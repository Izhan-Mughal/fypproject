import "dotenv/config";
import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDb from './db/index.js';
const app = express();
app.use((cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true

}
)))
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
// routes
// import userRouter from './router/auth-router.js';
import userRouter from './router/user.routes.js';
const PORT = process.env.PORT;
// routes declaration
// app.use("/api/auth", router)
app.use("/api/v1/users", userRouter)

connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`server is running at port: ${PORT}`);
    });
})
