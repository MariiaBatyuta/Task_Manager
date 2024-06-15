import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
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
        ref: 'User',  // Ensure 'User' matches your user model name
        required: true,
    },
    columns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Column' }], 
},
{
    versionKey: false,
    timestamps: true,
});

export default mongoose.model('Board', boardSchema);
