import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        default: null,
    }, 
    theme: {
        type: String,
        enum: ["light", "dark", "violet"],
        default: "dark",
    },
    photo: {
        type: String,
        default: null,
    }
},
    {
        versionKey: false,
        timestamps: true,
    }
);

export default mongoose.model("User", userSchema);