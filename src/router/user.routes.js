import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()
// console.log("working")
router.route("/register").post(upload.fields([{
    name: "industryType",
    maxCount: 1
}]
), registerUser)
router.route("/login").post(loginUser)
// secured routes
router.route("/logout").post(verifyJWT,logoutUser)
// console.log("working 2 2")
// router.route("/login").post(loginUser)

export default router;