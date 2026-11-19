import express from "express"
import { courseCreate, courseDelete, courseGetAll, courseGetOne, courseUpdate, buyCourses } from "../controllers/course.controller.js";
import userMiddleware from "../middlewares/user.mid.js";
import adminMiddleware from "../middlewares/admin.mid.js";
const router=express.Router();

router.post("/create",adminMiddleware,courseCreate)
router.put("/update/:course_id",adminMiddleware,courseUpdate)
router.delete("/delete/:course_id",adminMiddleware,courseDelete)

router.get("/allcourses",courseGetAll)
router.get("/:course_id",courseGetOne)

router.post("/buy/:course_id",userMiddleware,buyCourses)

export default router;