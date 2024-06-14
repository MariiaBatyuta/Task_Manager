import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high", "without"],
        default: "without",
    },
    deadline: {
        type: Date,
        default: null,
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Column', required: true },
},
{
    versionKey: false,
    timestamps: true,
});

export default mongoose.model('Card', cardSchema); 