// const mongoose = require("mongoose");
import mongoose from "mongoose";
// const bcrypt = require("bcryptjs");
import bcrypt from 'bcryptjs'
// const jwt = require("jsonwebtoken");
import jwt from 'jsonwebtoken'
const portfolioSchema = new mongoose.Schema({
    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    companyName: {
        type: String,
        unique:true,
        trim:true,
        require: true,
    },
    website: {
        type: Number,
        require: false,
    }

},
    {
        timestamps: true,
    })


const Portfolio = new mongoose.model('Portfolio', portfolioSchema);

// module.exports = User;
export default Portfolio;