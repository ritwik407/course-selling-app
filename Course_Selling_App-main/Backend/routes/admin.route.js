import express from "express"
import { loginAdmin, logoutAdmin, signupAdmin } from "../controllers/admin.controller.js";
const router=express.Router();

router.post("/signup",signupAdmin)
router.post("/login",loginAdmin)
router.get("/logout",logoutAdmin)

export default router;