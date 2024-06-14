import { sendMail } from "../mail.js";
import Board from "../models/boardModel.js";
import Column from "../models/columnModel.js";
import Card from "../models/cardModel.js";
import { needHelpSchema } from "../schemas/needHelpSchemas.js";

export const getTheBoard = async (req, res, next) => {
    const { id } = req.params;
    try {
        const board = await Board.findOne({ _id: id, owner: req.user.id }).populate('columns');
        if (!board) return res.status(404).send({ message: "Board not found" });

        res.status(200).send(board);
    } catch (error) {
        next(error);
    }
};

export const getAllBoards = async (req, res, next) => {
    try {
        const boards = await Board.find({ owner: req.user.id });
        if (!boards) return res.status(404).send({ message: "Board not found" });

        res.status(200).send(boards);
    } catch (error) {
        next(error);
    }
};

export const addNewBoard = async (req, res, next) => {
    const { title, icon, background } = req.body;
    try {
        if (Object.keys(req.body).length === 0) return res.status(400).send({ message: "You need add some information in request" });

        const board = await Board.create({
            title,
            icon,
            background,
            owner: req.user.id,
        });

        res.status(200).send(board);
    } catch (error) {
        next(error);
    }
};

export const editBoard = async (req, res, next) => {
    const { id } = req.params;
    const { title, icon, background } = req.body;
    try {
        const board = await Board.findOneAndUpdate({ _id: id, owner: req.user.id }, { title, icon, background }, { new: true });
        if (!board) return res.status(404).send({ message: "Board not found" });

        res.status(200).send(board);
    } catch (error) {
        next(error);
    }
};

export const deleteBoard = async (req, res, next) => {
    const { id } = req.params;
    try {
        const board = await Board.findOneAndDelete({ _id: id, owner: req.user.id });
        if (!board) return res.status(404).send({ message: "Board not found" });

        const columns = await Column.find({ owner: id });
        const columnIds = columns.map(column => column._id);

        await Card.deleteMany({ owner: { $in: columnIds } });
        await Column.deleteMany({ owner: id });
        
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

// columns 

export const getTheColumn = async(req, res, next) => {
const { id } = req.params;
    try {
        const column = await Column.findOne({ _id: id });
        if (!column) return res.status(404).send({ message: "Column not found" });

        res.status(200).send(column);
    } catch (error) {
        next(error);
    }
};

export const getAllColumns = async (req, res, next) => {
    const { boardId } = req.params;
    try {
        const columns = await Column.find({ owner: boardId });
        res.status(200).send(columns);
    } catch (error) {
        next(error);
    }
};

export const addNewColumn = async (req, res, next) => {
    const { title } = req.body;
    const { boardId } = req.params; 
    try {
        if (Object.keys(req.body).length === 0) return res.status(400).send({ message: "You need add some information in request" });
        
        const board = await Board.findById(boardId);
        if (!board) return res.status(404).send({ message: "Board not found" });

        const column = await Column.create({
            title,
            owner: boardId,
        });

        board.columns.push(column._id);
        await board.save();

        res.status(200).send(column);
    } catch (error) {
        next(error);
    }
};

export const editColumn = async (req, res, next) => {
    const { id } = req.params;
    const { title } = req.body;
    try {
        const column = await Column.findByIdAndUpdate({ _id: id }, { title }, { new: true });
        if (!column) return res.status(404).send({ message: "Column not found" });

        res.status(200).send(column);
    } catch (error) {
        next(error);
    }
};

export const deleteColumn = async (req, res, next) => {
const { id } = req.params;
    try {
        const column = await Column.findByIdAndDelete(id);
        if (!column) return res.status(404).send({ message: "Column not found" });

        await Card.deleteMany({ owner: id });

        await Board.updateOne({ columns: column._id }, { $pull: { columns: column._id } });

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

// cards

export const getTheCard = async (req, res, next) => {
    const { id } = req.params;
    try {
        const card = await Card.findById(id);
        if (!card) return res.status(404).send({ message: "Card not found" });

        res.status(200).send(card);
    } catch (error) {
        next(error);
    }
};


export const getAllCards = async (req, res, next) => {
    try {
        const boards = await Board.find({ owner: req.user.id }).populate({
            path: 'columns',
            populate: { path: 'cards' }
        });

        if (!boards || boards.length === 0) return res.status(404).send({ message: "Boards not found" });

        let allCards = [];
        boards.forEach(board => {
            board.columns.forEach(column => {
                allCards = allCards.concat(column.cards);
            });
        });

        if (allCards.length === 0) return res.status(404).send({ message: "Cards not found" });

        res.status(200).send(allCards);
    } catch (error) {
        next(error);
    }
};


export const addNewCard = async (req, res, next) => {
    const { title, description, priority, deadline } = req.body;
    const { columnId } = req.params;
    try {
        if (Object.keys(req.body).length === 0) return res.status(400).send({ message: "You need add some information in request" });
        
        const column = await Column.findById(columnId);
        if (!column) return res.status(404).send({ message: "Column not found" });

        const card = await Card.create({
            title,
            description,
            owner: columnId,
            priority,
            deadline,
        });

        column.cards.push(card._id);
        await column.save();

        res.status(200).send(card);
    } catch (error) {
        next(error);
    }
};

export const editCard = async (req, res, next) => {
    const { id } = req.params;
    const { title, description, priority, deadline } = req.body;
    try {
        const card = await Card.findByIdAndUpdate({ _id: id }, { title, description, priority, deadline }, { new: true });
        if (!card) return res.status(404).send({ message: "Card not found" });

        res.status(200).send(card);
    } catch (error) {
        next(error);
    }
};

export const deleteCard = async (req, res, next) => {
    const { id } = req.params;
    try {
        const card = await Card.findByIdAndDelete(id);
        if (!card) return res.status(404).send({ message: "Card not found" });

        await Column.updateOne({ cards: card._id }, { $pull: { cards: card._id } });

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

// filter

export const filteredByPriority = async (req, res, next) => {
    const { priority } = req.params;
    try {
        const board = await Board.findOne({ owner: req.user.id });
        if (!board) return res.status(404).send({ message: "Board not found" });

        const columns = await Column.find({ _id: { $in: board.columns } });
        if (!columns) return res.status(404).send({ message: "Columns not found" });

        const columnIds = columns.map(column => column._id);

        const cards = await Card.find({ owner: { $in: columnIds }, priority });
        if (!cards) return res.status(404).send({ message: "Cards not found" });

        
        res.status(200).send(cards);
    } catch (error) {
        next(error);
    }
};


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