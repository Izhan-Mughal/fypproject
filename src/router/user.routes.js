import { Router } from "express";
import { forgetUserPassword, loginUser, logoutUser, registerUser, resetUserPassword, verifyUserEmail } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()
// console.log("working")
router.route("/register").post(upload.fields([{
    name: "companyLogo",
    maxCount: 1
}]
), registerUser)
router.route("/login").post(loginUser)
// secured routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/verify").post(verifyUserEmail)
router.route("/forgetPassword").post(forgetUserPassword)
router.route("/resetPassword").post(resetUserPassword)
// console.log("working 2 2")
// router.route("/login").post(loginUser)

export default router;