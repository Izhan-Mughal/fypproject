// const mongoose = require("mongoose");
import mongoose from "mongoose";
// const bcrypt = require("bcryptjs");
import bcrypt from 'bcryptjs'
// const jwt = require("jsonwebtoken");
import jwt from 'jsonwebtoken'
const accTypeSchema = new mongoose.Schema({
    accountName: {
        type: String,
        require: true,
    }
},
    {
        timestamps: true,
    })


const accType = new mongoose.model('accType', accTypeSchema);

// module.exports = User;
export default accType;