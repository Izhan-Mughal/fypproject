// const mongoose = require("mongoose");
import mongoose from "mongoose";
// const bcrypt = require("bcryptjs");
import bcrypt from 'bcryptjs'
// const jwt = require("jsonwebtoken");
import jwt from 'jsonwebtoken'
const userDetailSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    userName: {
        type: String,
        unique: true,
        trim: true,
        require: true,
    },
    country: {
        type: String,
        trim: true,
        require: true,
    },
    companyLogo: {
        type: String,
        trim: true,
        require: false,
    },
    companyBio: {
        type: String,
        require: false,
    },
    pitchDeck: {
        type: String,
        trim: true,
        require: false,
    },
    website: {
        type: String,
        trim: true,
        require: false,
    },
    totalInvestment: {
        type: Number,
        trim: true,
        require: false,
    },
    maxInvestment: {
        type: Number,
        trim: true,
        require: false,
    },
    fundingRaise: {
        type: Boolean,
        trim: true,
        require: false,
    },
    founderName: {
        type: String,
        trim: true,
        require: false,
    },
    teamSize: {
        type: String,
        trim: true,
        require: false,
    },
    facebook: {
        type: String,
        trim: true,
        require: false,
    },
    linkedin: {
        type: String,
        trim: true,
        require: false,
    },
    twitter: {
        type: String,
        trim: true,
        require: false,
    },
    targetCountry: {
        type: String,
        trim: true,
        require: false,
    }
},
    {
        timestamps: true,
    })


const UserDetail = new mongoose.model('userDetail', userDetailSchema);

// module.exports = User;
export default UserDetail;