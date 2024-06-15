import "dotenv/config";
import "./db/db.js";

import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";

import authRouter from "./routes/authRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";

const app = express();

const swaggerDocument = JSON.parse(fs.readFileSync(path.resolve('./swagger.json'), 'utf8'));

app.use(cors());
app.use(express.json());

app.use("/api/users", authRouter);
app.use("/api", dashboardRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((_, res) => {
    res.status(404).send({ message: "Route not found" });
});

app.use((error, req, res, next) => {
    const { status = 500, message = "Server error" } = error;
    res.status(status).send({ message });
});

const port = process.env.PORT || 9000;
app.listen(port, () => {
    console.log(`Server is running. Use our API on port: ${port}`);
});
