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
        trim: true,
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
        type: Number,
        trim: true,
        require: false,
    },
    founderName: {
        type: Number,
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
userDetailSchema.pre("save", async function (next) {
    const user = this;
    if (!user.isModified("password")) {
        next();
    }
    try {
        const saltRound = await bcrypt.genSalt(10);
        const hash_password = await bcrypt.hash(user.password, saltRound);
        user.password = hash_password;
    } catch (error) {
        next(error);
    }
});
// Json Web Token 
userDetailSchema.methods.generateToken = async function () {
    try {
        return jwt.sign({
            userId: this._id.toString(),
            email: this.email,
            isAdmin: this.isAdmin,
        },
            process.env.JWT_SECRET_KEY, {
            expiresIn: "30d",
        }
        )
    } catch (error) {
        console.error(error);
    }

}
userDetailSchema.methods.comparePassword = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
}

const UserDetail = new mongoose.model('userDetail', userDetailSchema);

// module.exports = User;
export default UserDetail;