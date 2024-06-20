import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../cloudinary/cloudinaryConfig.js";
import path from "path";
import crypto from "crypto";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    format: async (req, file) => 'png',
    params: {
        folder: 'taskManager_photo',
        format: async (req, file) => 'png',
        public_id: (_, file) => {
            const extname = path.extname(file.originalname);
            const suffix = crypto.randomUUID();
            return `${extname}-${suffix}`;
        },
        transformation: [
            { width: 64, height: 64, crop: 'fill', quality: 1 }
        ]
    }
});

const upload = multer({ storage: storage });
export const avatarMiddleware = upload.single("avatar");