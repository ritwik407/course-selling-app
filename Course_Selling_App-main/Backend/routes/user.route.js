import express from "express"
import { loginUser, logoutUser, purchasedCourse, signupUser } from "../controllers/user.controller.js";
import userMiddleware from "../middlewares/user.mid.js";
const router=express.Router();

router.post("/signup",signupUser)
router.post("/login",loginUser)
router.get("/logout",logoutUser)
router.get("/purchases",userMiddleware,purchasedCourse)

export default router;