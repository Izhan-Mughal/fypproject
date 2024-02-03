import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router()
console.log("working")
router.route("/register").post(upload.fields([{
    name: "ProductImg",
    maxCount: 1
}]
), registerUser)
console.log("working 2 2")
// router.route("/login").post(loginUser)

export default router;