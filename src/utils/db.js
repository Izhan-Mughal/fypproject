// const mongoose = require("mongoose");
import mongoose from "mongoose";
// const URI = "mongodb://127.0.0.1:27017/mern_admin";
// const URI = "mongodb+srv://Izhan:SqwB8yfPO7N4eKdh@cluster0.bbuoliz.mongodb.net/mern_admin?retryWrites=true&w=majority";
const URI = process.env.MONGODB_URI;
// mongoose.connect(URI);
const connectDb = async () => {
    try {
        await mongoose.connect(URI);
        console.log("connection successful to DB")
    } catch (error) {
        console.error("database connection failed")
        process.exit(0);
    }

};
// module.exports = connectDb;
export default connectDb;