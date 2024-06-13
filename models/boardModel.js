import mongoose from "mongoose";

const boardModel = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        default: null,
    },
    background: {
        type: String,
        default: null,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    columns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Column' }], 
},
{
    versionKey: false,
    timestamps: true,
});

export default mongoose.model('board', boardModel);

