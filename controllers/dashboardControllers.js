import { sendMail } from "../mail.js";
import User from "../models/usersModel.js";
import { needHelpSchema } from "../schemas/needHelpSchemas.js";





// need help

export const needHelp = async (req, res, next) => {
    const { email, message } = req.body;

    try {
        if (Object.keys(req.body).length === 0) return res.status(400).send({ message: "Message must include any text" });

        const { error } = needHelpSchema.validate({ email, message });
        if (error) return res.status(400).send({ message: error.message });

        sendMail(email, message);

        res.status(200).send({ message: "Message send successfully" });
    } catch (error) {
        next(error);
    }
}