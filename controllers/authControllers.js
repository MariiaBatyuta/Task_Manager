import User from "../models/usersModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { userRegisterSchema, userLoginSchema, userUpdateInfo } from "../schemas/authSchemas.js";
import queryString from "query-string";
import axios from "axios";
import URL from "url";

export const userRegister = async (req, res, next) => {
    const { name, email, password } = req.body;

    if(Object.keys(req.body).length === 0) return res.status(400).send({ message: "To register, you must provide all the necessary information about the user." });

    try {
        const { error } = userRegisterSchema.validate({ name, email, password });
        if (error) return res.status(400).send({ message: res.message });

        const user = await User.findOne({ email: email.toLowerCase() });
        if (user !== null) return res.status(409).send({ message: "Email in use" });

        const passwordHash = await bcrypt.hash(password, 10);

        const createdUser = await User.create({
            name,
            email: email.toLowerCase(),
            password: passwordHash,
        });
        
        const token = jwt.sign({ id: createdUser._id, email: createdUser.email }, process.env.JWT_SECRET,  { expiresIn: '1h' });

        const userWithToken = await User.findByIdAndUpdate(createdUser._id, { token }, { new: true }).select('-password');

        res.status(201).send(userWithToken);
    } catch (error) {
        next(error);
    }
};

export const userLogin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        if (Object.keys(req.body).length === 0) return res.status(400).send({ message: "Email or password is wrong" });
        
        const { error } = userLoginSchema.validate({ email, password });
        if (error) return res.status(400).send({ message: error.message });

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(401).send({ message: "Email or password is wrong" });

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return res.status(401).send({ message: "Email or password is wrong" });

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET,  { expiresIn: '1h' });

        const userWithToken = await User.findByIdAndUpdate(user._id, { token }, {new: true}).select('-password');

        res.status(200).send(userWithToken);
    } catch (error) {
        next(error);
    }
};

export const userLogout = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(401).send({ message: "Not authorized!" });

        await User.findByIdAndUpdate(req.user.id, { token: null });

        res.status(200).send({ message: "Logout successful" });
    } catch (error) {
        next(error);
    }
};


// get and update user information

export const userGetInfo = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(401).send({ message: "Not authorized!" });

        const { name, email } = user;

        res.status(200).send({ name, email });
    } catch (error) {
        next(error);
    }
};

export const userUpdate = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name && !email && !password) {
            return res.status(400).send({ message: "Body must have at least one field" });
        }

        const { error } = userUpdateInfo.validate({ name, email, password });
        if (error) return res.status(200).send({ message: error.message });

        const updateInfo = {};
        if (name) updateInfo.name = name;
        if (email) updateInfo.email = email;
        if (password) updateInfo.password = await bcrypt.hash(password, 10);

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).send({ message: "Not authorized!" });
        }

        const updatedUser = await User.findByIdAndUpdate(req.user.id, updateInfo, { new: true });
        if (!updatedUser) {
            return res.status(404).send({ message: "Not found!" });
        }

        res.status(200).send(updatedUser);
    } catch (error) {
        next(error);
    }
};

// user avatar
export const userPhoto = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).send({ message: "User not found!" });
        if (!user.photo) return res.status(404).send({ message: "Avatar not found!" });

        res.status(200).send({ avatar: user.photo });
    } catch (error) {
        next(error);
    }
};

export const userUpdatePhoto = async (req, res, next) => {
    try {
        if (!req.file) return res.status(404).send({ message: "No file uploaded" });

        const user = await User.findByIdAndUpdate(req.user.id, { photo: req.file.path }, { new: true });
        if (!user) return res.status(401).send({ message: "Not authorized!" });

        res.status(200).send({ avatar: user.photo });
    } catch (error) {
        next(error);
    }
};

// user change theme

export const userGetTheme = async (req, res, next) => {
   try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(401).send({ message: "Not authorized" });

        res.status(200).send({theme: user.theme});
    } catch (error) {
        next(error);
    }
}

export const userUpdateTheme = async (req, res, next) => {
    const allowedTheme = ["light", "dark", "violet"];
    const { theme } = req.body;

    try {
        if (!allowedTheme.includes(theme)) return res.status(400).send({ message: "Incorrect theme type" });

        const user = await User.findByIdAndUpdate(req.user.id, { theme }, { new: true });
        if (!user) return res.status(401).send({ message: "Not authorized" });

        res.status(200).send({theme: user.theme});
    } catch (error) {
        next(error);
    }
}

// google
export const authGoogle = (_, res) => {
    try {
        const params = queryString.stringify({
            client_id: process.env.GOOGLE_CLIENT_ID,
            redirect_uri: "https://task-manager-r8dz.onrender.com/api/users/auth/google/callback", 
            response_type: "code",
            scope: "profile email",
            prompt: "consent",
            access_type: "offline",
        });

        res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
    } catch (error) {
        console.error('Error in Google OAuth redirection:', error.message);
        res.status(500).send('Error redirecting to Google OAuth');
    }
};

export const callbackGoogle = async (req, res, next) => {
    const { code } = req.query;

    try {
        if (!code) {
            throw new Error("Authorization code not provided");
        }

        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: "https://task-manager-r8dz.onrender.com/api/users/auth/google/callback", 
            grant_type: 'authorization_code',
        });
        const { access_token } = tokenResponse.data;

        const userResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        const { name, email } = userResponse.data;

        const user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
            });
        };
        
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        await User.findByIdAndUpdate(user._id, { token }, { new: true });

        res.redirect(`https://task-manager-jet-psi.vercel.app/login/google?token=${token}`); 
    } catch (error) {
        console.error('Error during Google OAuth callback:', error.message);
        next(error);
    }
};