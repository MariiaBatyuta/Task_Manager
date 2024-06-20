import express from "express";
import { userLogin, userLogout, userRegister, userGetInfo, userUpdate, userUpdatePhoto, userPhoto, userGetTheme, userUpdateTheme, authGoogle, callbackGoogle } from "../controllers/authControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { avatarMiddleware } from "../middleware/avatarMiddleware.js";

const authRouter = express.Router();
const jsonParser = express.json();

authRouter.post("/register", jsonParser, userRegister);
authRouter.post("/login", jsonParser, userLogin);
authRouter.post("/logout", authMiddleware, userLogout);

authRouter.get("/info", authMiddleware, userGetInfo);
authRouter.put("/edit", authMiddleware, userUpdate);

authRouter.get("/avatar", authMiddleware, userPhoto);
authRouter.put("/edit-avatar", authMiddleware, avatarMiddleware, userUpdatePhoto);

authRouter.get("/getTheme", authMiddleware, userGetTheme);
authRouter.patch("/theme", authMiddleware, userUpdateTheme);

authRouter.get("/auth/google", authGoogle);
authRouter.get("/auth/google/callback", callbackGoogle);

export default authRouter;