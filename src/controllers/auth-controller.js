// const User = require("../models/users-model");
import User from "../models/users.models.js"
const home = async (req, res) => {
    try {
        res
            .status(200)
            .send("Welcome to Home");
    } catch (error) {
        console.log(error);
    }
}
const register = async (req, res) => {
    try {
        // console.log(req.body)
        const { username, email, phone, password } = req.body;
        const userExists = await User.findOne({ email: email });
        if (userExists) {
            return res.status(400).json({ msg: "email already exists" })
        }
        // hashpassword
        // const saltRound = 10;
        // const hash_password = await bcrypt.hash(password, saltRound);
        const userCreated = await User.create({ username, email, phone, password });
        res
            .status(200)
            .json({
                msg: "registratiion successful",
                token: await userCreated.generateToken(),
                userId: userCreated._id.toString()
            });
    } catch (error) {
        res
            .status(500)
            .json("internal server error");
        console.log(error);
    }
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExist = await User.findOne({ email });
        console.log(userExist)

        if (!userExist) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // const isPasswordValid = comparePassword();
        const isPasswordValid = await userExist.comparePassword(password);
        // console.log("hi")
        if (isPasswordValid) {
            res
                .status(200)
                .json({
                    msg: "login successful",
                    token: await userExist.generateToken(),
                    userId: userExist._id.toString()
                });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
        // const { email, password } = req.body;
        // const userExist = await User.findOne({ email });
        // console.log(userExist)
        // if (!userExist) {
        //     return res.status(400).json({ message: "Invalid Credentials" });
        // }
        // const isPasswordValid = await bcrypt.compare(password, userExist.password);

        // if (isPasswordValid) {
        //     res
        //         .status(200)
        //         .json({
        //             msg: "login successful",
        //             token: await userExist.generateToken(),
        //             userId: userExist._id.toString()
        //         });
        // } else {
        //     res.status(401).json({ message: "Invalid email or password" });
        // }


    } catch (error) {
        res
            .status(500)
            .json("internal server error");
    }

}
// module.exports = { home, register, login };
export default{
    home,
    register,
    login

}