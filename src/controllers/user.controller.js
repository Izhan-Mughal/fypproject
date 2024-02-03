import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/users.models.js"
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
    // res.status(200).json({
    //     message:"ok"
    // })
    // get  user details
    const { email, password, industryType } = req.body
    console.log("email:", email)
    if ([email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Email and password are required");
    }
    const existedUser = await User.findOne({
        eq: { email }
    })
    if (existedUser) {
        throw new ApiError(409, "User with this email already exist")
    }
    const user = await User.create({
        email,
        password,
        industryType,
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )

    // validation
    // user already exist by username and email
    // check for avatar
    // check for images check for groupphoto
    // 
})
export { registerUser }