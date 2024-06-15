import cloudinary from "./cloudinaryConfig.js";

export const getBackgroundUrls = async (publicId) => {
    if (publicId === 'default') {
        return {
            laptop: null,
            tablet: null,
            phone: null,
        };
    }ж

    const folders = ['laptop', 'tablet', 'phone'];
    const urls = {};

    for (const folder of folders) {
        try {
            const result = await cloudinary.api.resource(`backgrounds/${folder}/${publicId}`);
            urls[folder] = result.secure_url;
        } catch (error) {
            console.error(`Error retrieving image from folder ${folder}:`, error);
            throw error;
        }
    }

    return urls;
};
