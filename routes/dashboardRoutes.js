import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { needHelp } from "../controllers/dashboardControllers.js";

const dashboardRouter = express.Router();
const jsonParser = express.json();

dashboardRouter.post("/need-help", jsonParser, authMiddleware, needHelp);

export default dashboardRouter;