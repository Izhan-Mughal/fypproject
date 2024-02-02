// const mongoose = require("mongoose");
import mongoose from "mongoose";
// const bcrypt = require("bcryptjs");
import bcrypt from 'bcryptjs'
// const jwt = require("jsonwebtoken");
import jwt from 'jsonwebtoken'
const userSchema = new mongoose.Schema({

    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    investorType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'investorType',
    },
    industryType: {
        type: String,
        require: false,
    },
    isActive: {
        type: String,
        require: false,
    },
    accType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'accType',
    }
},
    {
        timestamps: true,
    })
userSchema.pre("save", async function (next) {
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
userSchema.methods.generateToken = async function () {
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
userSchema.methods.comparePassword = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
}

const User = new mongoose.model('User', userSchema);

// module.exports = User;
export default User;