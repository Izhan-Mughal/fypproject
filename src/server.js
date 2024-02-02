// require('dotenv').config();
import "dotenv/config";


// const express = require("express");
import express from 'express';
const app = express();
// const router = require("./router/auth-router")
import router from './router/auth-router.js';
// const connectDb = require("./utils/db")
import connectDb from './db/index.js';
app.use(express.json());
const PORT = process.env.PORT;
app.use("/api/auth", router)
// app.get("/", (req, res) => {
//     res.status(200).send("Welcome to my Home Page");

// });
// app.get("/register", (req, res) => {
//     res.status(200).send("Welcome to Registration");

// });
connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`server is running at port: ${PORT}`);
    });
})
