import mongoose from "mongoose";

const columnSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: true,
    },
    cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }], 
},
{
    versionKey: false,
    timestamps: true,
});

export default mongoose.model('Column', columnSchema);