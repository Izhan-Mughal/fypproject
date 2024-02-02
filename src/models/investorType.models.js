// const mongoose = require("mongoose");
import mongoose from "mongoose";
// const bcrypt = require("bcryptjs");
import bcrypt from 'bcryptjs'
// const jwt = require("jsonwebtoken");
import jwt from 'jsonwebtoken'
const investorTypeSchema = new mongoose.Schema({
    typeName: {
        type: String,
        require: true,
    },
})


const investorType = new mongoose.model('investorType', investorTypeSchema);

// module.exports = User;
export default investorType;