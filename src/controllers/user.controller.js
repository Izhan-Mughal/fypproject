import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/users.models.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)

        const accessToken = await user.generateToken();
        const refreshToken = await user.generateRefreshToken();
        // console.log(refreshToken)
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }

    } catch (error) {
        console.log(error)
        throw new ApiError(500, "something went wrong while generating token")
    }
}
const registerUser = asyncHandler(async (req, res) => {
    // res.status(200).json({
    //     message:"ok"
    // })
    // get  user details
    // const { email, password, industryType , acctype } = req.body
    const { email, password } = req.body
    console.log("email:", email)
    if ([email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Email and password are required");
    }
    const existedUser = await User.findOne({ email: email })
    // console.log(existedUser, "EXISTED USER")
    if (existedUser) {
        throw new ApiError(409, "User with this email already exist")
    }
    const companyLogoLocalPath = req.files?.industryType[0]?.path;
    // if(!companyLogoLocalPath){
    //     throw new ApiError(400 , "Company")
    // }
    // console.log(companyLogoLocalPath)
    const companyLogo = await uploadOnCloudinary(companyLogoLocalPath);
    // console.log(companyLogo);
    const user = await User.create({
        email,
        password,
        industryType: companyLogo.url
    })
    // if(acctype){

    // }
    // objec inv {
    //     ddd : req 
    // }
    // user detail
    // const user = await User.create({
    //     userid : user._id,
    //     password,
    //     industryType,
    // })

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    //  user ki id se   //  
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
const loginUser = asyncHandler(async (req, res) => {
    // req body > data
    // user name or email
    // find user
    // password check
    // access and refresh token
    // send cookie
    const { email, password } = req.body;
    if (!email) {

        throw new ApiError(400, "Email is required")

    }
    // console.log(email)
    const user = await User.findOne({ email: email });
    // console.log(user);
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }
    const isPasswordvalid = await user.comparePassword(password);
    if (!isPasswordvalid) {
        throw new ApiError(401, "Invalid User Credentials")

    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedinUser = await User.findById(user._id).select("-password -refreshToken");
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedinUser, accessToken,
                    refreshToken
                }, "User Logged in SuccessFully"
            )
        )

})
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id, {
        $set: {
            refreshToken: undefined
        }
    }, {
        new: true
    }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User Logged Out SuccessFully"))
})
export { registerUser, loginUser, logoutUser }