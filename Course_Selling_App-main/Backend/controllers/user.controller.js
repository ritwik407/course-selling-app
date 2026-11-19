import userModel from "../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { z } from "zod";
import purchaseModel from "../models/purchase.model.js";
import courseModel from "../models/course.model.js";

const signupUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body
    const userSchema = z.object({
        firstName: z.string().min(3, { message: "first name must be 3 character long" }),
        lastName: z.string().min(3, { message: "last name must be 3 character long" }),
        email: z.email(),
        password: z.string().min(3, { message: "password must be 3 character long" }),
    })
    const validateData = userSchema.safeParse(req.body)
    if (!validateData.success) {
        return res.status(400).json({ error: validateData.error.issues.map(err => err.message) })
    }
    try {
        const userExist = await userModel.findOne({ email });
        if (userExist) {
            return res.status(400).json({
                message: "User already exist"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new userModel({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })
        await newUser.save();
        return res.status(201).json({
            message: "User created successfully",
            newUser
        })
    } catch (error) {
        console.log("Error in registering user");
        return res.status(500).json({
            message: "Error in registering user",
            error: error.message
        })
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const userSchema = z.object({
        email: z.string().email("email is required"),
        password: z.string().min(1, "Password is required")
            .min(3, "Password must be at least 3 characters")
    })
    const validateData = userSchema.safeParse(req.body)
    if (!validateData.success) {
        return res.status(400).json({ error: validateData.error.issues.map(err => err.message) })
    }
    try {
        // if (!email || !password) {
        //     return res.status(403).json({
        //         message: "Please provide email and password"
        //     });
        // }
        const userExist = await userModel.findOne({ email });
        if (!userExist) {
            return res.status(401).json({
                message: "Invalid Username or Password"
            })
        }
        const isPasswordCorrect = await bcrypt.compare(password, userExist.password);
        if (!isPasswordCorrect) {
            return res.status(403).json({
                message: "Invalid Username or Password"
            })
        }
        const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
        userExist.password = undefined
        const cookieOptions = {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict"
        }
        res.cookie("jwt", token, cookieOptions);
        return res.status(200).json({
            message: "user logged in successfully",
            user: userExist,
            token
        })
    } catch (error) {
        console.log("Error in login a user");
        return res.status(500).json({
            message: "Error in login a user",
            error: error.message
        })
    }
}

const logoutUser = (req, res) => {
    try {
        if(!req.cookies.jwt){
            return res.status(401).json({message:"Kindly login first"})
        }
        res.clearCookie("jwt");
        return res.status(200).json({ message: "User logged out successfully" })
    } catch (error) {
        console.log("Error in logout user");
        return res.status(500).json({
            message: "Error in logout user",
            error: error.message
        })
    }
}

const purchasedCourse = async (req, res) => {
    const userId = req.userId;
    try {
        const purchased = await purchaseModel.find({ userId })
        let purchasedCourseId = []
        for (let i = 0; i < purchased.length; i++) {
            purchasedCourseId.push(purchased[i].course_id)
        }
        const courseData = await courseModel.find({
            _id: { $in: purchasedCourseId }
        })
        return res.status(200).json({
            message: "Success",
            purchased,
            courseData
        })
    } catch (error) {
        console.log("Error getting purchased course", error);
        return res.status(500).json({
            message: "Error getting purchased course",
            error: error.message
        })
    }
}

export { signupUser, loginUser, logoutUser, purchasedCourse }