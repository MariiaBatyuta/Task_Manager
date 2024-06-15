// dashboardRoutes.js
import express from "express";
import { needHelp, getTheBoard, getAllBoards, addNewBoard, editBoard, deleteBoard, getTheColumn, getAllColumns, addNewColumn, editColumn, deleteColumn, getTheCard, getAllCards, addNewCard, editCard, deleteCard, filteredByPriority } from "../controllers/dashboardControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const dashboardRouter = express.Router();
const jsonParser = express.json();

// Boards
dashboardRouter.get("/getBoard/:id", jsonParser, authMiddleware, getTheBoard);
dashboardRouter.get("/getBoards", jsonParser, authMiddleware, getAllBoards);
dashboardRouter.post("/board", jsonParser, authMiddleware, addNewBoard);
dashboardRouter.put("/editBoard/:id", jsonParser, authMiddleware, editBoard);
dashboardRouter.delete("/deleteBoard/:id", jsonParser, authMiddleware, deleteBoard);

// Columns
dashboardRouter.get("/getColumn/:id", jsonParser, authMiddleware, getTheColumn);
dashboardRouter.get("/getColumns",jsonParser, authMiddleware, getAllColumns);
dashboardRouter.post("/board/:boardId/column", jsonParser, authMiddleware, addNewColumn);
dashboardRouter.put("/editColumn/:id", jsonParser, authMiddleware, editColumn);
dashboardRouter.delete("/deleteColumn/:id", jsonParser, authMiddleware, deleteColumn);

// Cards
dashboardRouter.get("/getCard/:id", jsonParser, authMiddleware, getTheCard);
dashboardRouter.get("/getCards", jsonParser, authMiddleware, getAllCards);
dashboardRouter.post("/column/:columnId/card", jsonParser, authMiddleware, addNewCard);
dashboardRouter.put("/editCard/:id", jsonParser, authMiddleware, editCard);
dashboardRouter.delete("/deleteCard/:id", jsonParser, authMiddleware, deleteCard);

// Filters
dashboardRouter.get("/cards/filter/priority/:priority", jsonParser, authMiddleware, filteredByPriority);

// Help
dashboardRouter.post("/need-help", jsonParser, authMiddleware, needHelp);

export default dashboardRouter;
