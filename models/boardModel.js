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
        laptop: { type: String, default: null },
        tablet: { type: String, default: null },
        phone: { type: String, default: null },
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
        required: true,
    },
    columns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Column' }], 
},
{
    versionKey: false,
    timestamps: true,
});

export default mongoose.model('Board', boardSchema);
