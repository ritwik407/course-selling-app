import courseModel from "../models/course.model.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary"
import purchaseModel from "../models/purchase.model.js";
import userModel from "../models/user.model.js";

const courseCreate = async (req, res) => {
    const adminId = req.adminId;
    const { title, description, price } = req.body;
    const { image } = req.files
    try {
        if (!title || !description || !price) {
            return res.status(400).json({
                message: "Please fill all the field",
            })
        }
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                message: "No file uploaded"
            })
        }
        const allowedFormat = ["image/png", "image/jpeg"]
        if (!allowedFormat.includes(image.mimetype)) {
            return res.status(400).json({
                error: "Invalid file format. Only PNG and JPG are allowed"
            })
        }

        //Cloudinary Code
        const cloud_response = await cloudinary.uploader.upload(image.tempFilePath)
        if (!cloud_response || cloud_response.error) {
            return res.status(400).json({ error: "Error uploading file to cloudinary" })
        }

        const courseData = {
            title,
            description,
            price,
            image: {
                public_id: cloud_response.public_id,
                url: cloud_response.secure_url
            },
            creatorId: adminId
        }
        const course = await courseModel.create(courseData);
        res.status(200).json({
            message: "Course created successfully",
            course
        })
    } catch (error) {
        return res.status(500).json({
            message: "error creating course",
            error: error
        })

    }
}

const courseUpdate = async (req, res) => {
    const adminId = req.adminId
    const { course_id } = req.params
    const { title, description, price } = req.body;

    try {
        const courseExist = await courseModel.findById(course_id);
        if (!courseExist) {
            return res.status(404).json({ message: "Course not found" })
        }

        let updatedImage = courseExist.image;

        const file = req.files?.image || req.files?.imageUrl;
        if (file) {
            const image = file;

            const allowedFormat = ["image/png", "image/jpeg"];
            if (!allowedFormat.includes(image.mimetype)) {
                return res.status(400).json({
                    error: "Invalid file format. Only PNG and JPG are allowed"
                })
            }

            const cloud_response = await cloudinary.uploader.upload(image.tempFilePath)
            if (!cloud_response || cloud_response.error) {
                return res.status(400).json({ error: "Error uploading file to cloudinary" })
            }

            updatedImage = {
                public_id: cloud_response.public_id,
                url: cloud_response.secure_url
            }
        }

        const course = await courseModel.updateOne({
            _id: course_id,
            creatorId: adminId
        }, {
            title,
            description,
            price,
            image: updatedImage
        })

        return res.status(200).json({ messsage: "Course updated successfully", course })

    } catch (error) {
        console.log("Error in updating course", error);
        return res.status(500).json({ message: "Error in updating course" })
    }
}

const courseDelete = async (req, res) => {
    const adminId = req.adminId
    const { course_id } = req.params
    try {
        const course = await courseModel.findById(course_id);
        if (!course) {
            return res.status(404).json({
                message: "Course not found",
            });
        }

        const result = await courseModel.findOneAndDelete({ _id: course_id, creatorId: adminId })

        if (!result) {

            const course = await courseModel.findById(course_id).lean();
            console.log("Delete mismatch:", { course_id, adminId, courseCreatorId: course?.creatorId });

            return res.status(403).json({
                message: "Not authorized or course not found",
            });
        }


        return res.status(200).json({
            message: "Course deleted successfully",
        })

    } catch (error) {
        console.log("Error in deleting course", error);
        return res.status(500).json({ message: "Error in deleting course", error: error.message })
    }
}

const courseGetAll = async (req, res) => {
    try {
        const courses = await courseModel.find({}).lean();
        if (!courses.length) {
            return res.status(404).json({
                message: "No courses found"
            });
        }
        return res.status(200).json({
            message: "Successfully getting all courses.",
            courseLength: courses.length,
            courses
        })
    } catch (error) {
        console.log("Error in getting courses", error);
        return res.status(500).json({ message: "Error in getting all courses", error: error.message })
    }
}

const courseGetOne = async (req, res) => {
    const { course_id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(course_id)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }
        const course = await courseModel.findById(course_id).lean();
        if (!course) {
            return res.status(404).json({ message: "Invalid Course ID" })
        }
        return res.status(200).json({
            message: "Successfully getting single course",
            course
        })
    } catch (error) {
        console.log("Error in getting single course", error);
        res.status(500).json({
            message: "Error in getting single course",
            error: error.message
        })
    }
}

const buyCourses = async (req, res) => {
    const { userId } = req
    const { course_id } = req.params
    try {
        const course = await courseModel.findById(course_id)
        if (!course) {
            return res.status(404).json({
                message: "Course not found",
            })
        }
        const existingPurchase = await purchaseModel.findOne({ userId, course_id })
        if (existingPurchase) {
            return res.status(400).json({
                message: "User has already purchased this course"
            })
        }
        const newPurchase = new purchaseModel({ userId, course_id })
        await newPurchase.save();
        return res.status(201).json({
            message: "course purchased successfully",
            newPurchase
        })

    } catch (error) {
        return res.status(500).json({
            message: "Error in buying course",
            error: error.message
        })
        console.log("Error in buying course", error);
    }
}

export { courseCreate, courseUpdate, courseDelete, courseGetAll, courseGetOne, buyCourses }