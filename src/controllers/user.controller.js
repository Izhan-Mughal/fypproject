import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/users.models.js";
import AccType from "../models/accType.models.js";
import UserDetail from "../models/userdetail.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
// import accType from "../models/accType.models.js";
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
    const { email, password, industryType, userName, country, companyLogo, companyBio, pitchDeck, website, totalInvestment, maxInvestment, fundingRaise, founderName, teamSize, facebook, linkedin, twitter, targetCountry, accType } = req.body;

    console.log("email:", email)
    if ([email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Email and password are required");
    }
    const existedUser = await User.findOne({ email: email })
    const accTypeData = await AccType.findOne({ accountName: accType })
    // console.log(accTypeData);
    // console.log(existedUser, "EXISTED USER")
    if (existedUser) {
        throw new ApiError(409, "User with this email already exist")
    }
    console.log(accTypeData, accType)
    if (!accTypeData) {
        // throw new ApiError(404,)
        res.json(404, "This Account Type doesn't exist")
    }

    // const companyLogoLocalPath = req.files?.companyLogo?.path;
    // console.log("HI", req.files)
    // const companyLogoLocalPath = req.files?.companyLogo?.path;
    // console.log("HI", req.files)
    const companyLogoLocalPath = req.files?.companyLogo?.[0]?.path;
    console.log("HI", req.files?.companyLogo);
    // if (!companyLogoLocalPath) {
    //     throw new ApiError(400, "Company Logo NOT ADDED")
    // }
    // console.log(companyLogoLocalPath)
    const companyLogos = await uploadOnCloudinary(companyLogoLocalPath);
    // console.log(companyLogo);
    const user = await User.create({
        email,
        password,
        industryType,
        accType: accTypeData._id,
    })
    const verifytoken = jwt.sign({ user }, process.env.VERIFY_TOKEN_SECRET, { expiresIn: '5d' });
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            // user: 'testinguser00013@gmail.com', // replace with your email
            user: 'izhanmughal10@gmail.com', // replace with your email
            pass: 'hsgn rgcx rnit xwrd', // replace with your email password
            // pass: 'Testingapi123@', // replace with your email password
        },
    });
    const emailTemplate = (user, verifytoken) => `
  <html>
    <head>
      <title>Email Verification at HyperKonnect</title>
    </head>
    <body>
      <h2>Email Verification</h2>
      <p>Hello ${user},</p>
      <p>Thank you for signing up! To complete your registration, please click the button below to verify your email address:</p>
      <a href="http://localhost:3000/verify?Token=${verifytoken}" style="display:inline-block;padding:10px 20px;background-color:#3498db;color:#ffffff;text-decoration:none;border-radius:3px;">Verify Email</a>
      <p>If you did not sign up for our service, you can ignore this email.</p>
      <p>Best regards,<br>HyperKonnect</p>
    </body>
  </html>
`;
    const mailOptions = {
        from: 'izhanmughal10@gmail.com', // replace with your email
        to: user.email,
        subject: 'Email Verification at HyperKonnect',
        // text: `Click the following link to verify your email: http://localhost:3000/verify?Token=${verifytoken}`,
        html: emailTemplate(userName, verifytoken),
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.error('Error sending email:', error);
        }
        console.log('Email sent:', info.response);
        throw new ApiError(500, "Email SMTP")
    });
    const userdetail = await UserDetail.create({
        userId: user._id,
        userName,
        country,
        companyLogo: companyLogos.url,
        companyBio,
        pitchDeck,
        website,
        totalInvestment,
        maxInvestment,
        fundingRaise,
        founderName,
        teamSize,
        facebook,
        linkedin,
        twitter,
        targetCountry,



    });

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
    // testinguser00013@gmail.com
    // testingapi
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    const createdUserDetail = await UserDetail.findById(userdetail._id);

    //  user ki id se   //  
    if (!createdUser && !createdUserDetail) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }
    return res.status(201).json(
        new ApiResponse(200, createdUser + createdUserDetail, "User Registered Successfully")
    )

    // validation
    // user already exist by username and email
    // check for avatar
    // check for images check for groupphoto
    // 
})
const verifyUserEmail = asyncHandler(async (req, res) => {
    const { token } = req.query;
    console.log("verify Process Started");
    if (!token) {
        return res.status(400).json({ error: 'Token is missing' });
    }

    try {
        const decoded = await jwt.verify(token, process.env.VERIFY_TOKEN_SECRET);
        const email = decoded?.user.email;
        console.log(decoded, "DECODED var");
        console.log("THIS EMAIL " + decoded?.user.email);
        console.log(token);
        // Find the user in your database based on userId
        const user = await User.findOne({ email: email });
        console.log(user.isActive);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.isActive) {
            return res.status(200).json({ message: 'Email already verified' });
        }

        // Update user status in the database (set isVerified to true)
        user.isActive = true;
        await user.save();
        return res.status(200).json({ message: 'Email verification successful' });
    } catch (error) {
        console.error('Error verifying JWT token:', error.message);
        return res.status(401).json({ error: 'Invalid token' });
    }


})
const forgetUserPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ error: 'User not found.' });
    }
    const forgetToken = jwt.sign({ userId: user._id }, process.env.FORGET_TOKEN_SECRET, { expiresIn: '1d' });
    const expirationDate = Date.now() + 3600000;
    // console.log(expirationDate)
    user.resetToken = forgetToken;
    user.resetTokenExpiration = expirationDate;
    // console.log(user);
    await user.save();
    const emailTemplate = (user, forgetToken) => `
    <html>
      <head>
        <title>Password Recovery at HyperKonnect</title>
      </head>
      <body>
        <h2>Password Recovery</h2>
        <p>Hello ${user},</p>
        <p>Thank you for signing up! To complete your Password Recovery, please click the button below to change your password:</p>
        <a href="http://localhost:3000/resetPassword?Token=${forgetToken}" style="display:inline-block;padding:10px 20px;background-color:#3498db;color:#ffffff;text-decoration:none;border-radius:3px;">Verify Email</a>
        <p>If you did not sign up for our service, you can ignore this email.</p>
        <p>Best regards,<br>HyperKonnect</p>
      </body>
    </html>
  `;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            // user: 'testinguser00013@gmail.com', // replace with your email
            user: 'izhanmughal10@gmail.com', // replace with your email
            pass: 'hsgn rgcx rnit xwrd', // replace with your email password
            // pass: 'Testingapi123@', // replace with your email password
        },
    });
    const mailOptions = {
        from: 'izhanmughal10@gmail.com', // replace with your email
        to: email,
        subject: 'Password Reset at HyperKonnect',
        // text: `Click the following link to verify your email: http://localhost:3000/resetPassword?Token=${forgetToken}`,
        html: emailTemplate(email, forgetToken),
    };
    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset email sent.' });
    } catch (error) {
        console.error(error);
        // toast.error(error)
        res.status(500).json({ error: 'Error sending reset email.' });
    }
});


const resetUserPassword = asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Verify the JWT
        const decodedToken = jwt.verify(token, process.env.FORGET_TOKEN_SECRET);

        // Find the user by the decoded user ID
        const user = await User.findById(decodedToken.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Check if the reset token is still valid
        if (user.resetToken !== token || user.resetTokenExpiration < Date.now()) {
            return res.status(400).json({ error: 'Invalid or expired token.' });
        }

        // Update the user's password

        user.password = newPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;

        await user.save();

        res.status(200).json({ message: 'Password reset successful.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error resetting password.' });
    }




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
    // const uservalid = await User.findOne({ isActive: false });
    console.log(user);
    if (!user) {
        // throw new ApiError(404, "User does not exist");
        res.status(404).json("User does not exist")
    }
    console.log(user.isActive)
    if (!user.isActive) {
        // throw new ApiError(404, "User not Verified");
        res.status(404).json("User not Verified")
    }

    const isPasswordvalid = await user.comparePassword(password);
    if (!isPasswordvalid) {
        // throw new ApiError(401, "Invalid User Credentials")
        res.status(401).json("Invalid Credentials")

    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedinUser = await User.findById(user._id).select("-password -refreshToken");
    const options = {
        httpOnly: true,
        secure: true
    }
    console.log("THIS WORKING")
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        // .json(
        //     {
        //         user: loggedinUser, accessToken,
        //         refreshToken
        //     },
        //     "User Logged in SuccessFully"

        // )
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
export { registerUser, loginUser, logoutUser, verifyUserEmail, forgetUserPassword, resetUserPassword }