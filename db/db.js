import mongoose from "mongoose";

mongoose
    .connect(process.env.DB_URI)
    .then(() => console.log("Database connection successful"))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    } )