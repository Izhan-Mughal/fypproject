// const express = require("express");
import express from "express"
const router = express.Router();
// const authcontrollers = require("../controllers/auth-controller")
import authcontrollers from "../controllers/auth-controller.js"
// app.get("/", (req, res) => {
//     res.status(200).send("Welcome to my Home Page");

// });
// router.get("/", (req, res) => {
//     res
//         .status(200)
//         .send("Welcome to Home");

// });
router.route("/").get(authcontrollers.home);
router.route('/register').post(authcontrollers.register)
router.route('/login').post(authcontrollers.login)

// module.exports = router;
export default router;