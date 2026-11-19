import adminModel from "../models/admin.model.js"
import {z} from "zod";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const signupAdmin=async(req,res)=> {
    const { firstName, lastName, email, password } = req.body
    const adminSchema = z.object({
        firstName: z.string().min(3, { message: "first name must be 3 character long" }),
        lastName: z.string().min(3, { message: "last name must be 3 character long" }),
        email: z.email(),
        password: z.string().min(3, { message: "password must be 3 character long" }),
    })
    const validateData = adminSchema.safeParse(req.body)
    if (!validateData.success) {
        return res.status(400).json({ error: validateData.error.issues.map(err => err.message) })
    }
    try {
        const adminExist = await adminModel.findOne({ email });
        if (adminExist) {
            return res.status(400).json({
                message: "Admin already exist"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newAdmin = new adminModel({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })
        await newAdmin.save();
        return res.status(201).json({
            message: "User created successfully",
            newAdmin
        })
    } catch (error) {
        console.log("Error in registering admin");
        return res.status(500).json({
            message: "Error in registering admin",
            error: error.message
        })
    }
}
const loginAdmin=async(req,res)=>{
    const { email, password } = req.body;
    const adminSchema = z.object({
        email: z.string().email("email is required"),
        password: z.string().min(1, "Password is required")
            .min(3, "Password must be at least 3 characters")
    })
    const validateData = adminSchema.safeParse(req.body)
    if (!validateData.success) {
        return res.status(400).json({ error: validateData.error.issues.map(err => err.message) })
    }
    try {
        const adminExist = await adminModel.findOne({ email });
        if (!adminExist) {
            return res.status(401).json({
                message: "Invalid Username or Password"
            })
        }
        const isPasswordCorrect = await bcrypt.compare(password, adminExist.password);
        if (!isPasswordCorrect) {
            return res.status(403).json({
                message: "Invalid Username or Password"
            })
        }
        const token = jwt.sign({ id: adminExist._id }, process.env.JWT_ADMIN_PASSWORD, { expiresIn: "1d" })
        adminExist.password = undefined
        const cookieOptions = {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict"
        }
        res.cookie("jwt", token, cookieOptions);
        return res.status(200).json({
            message: "admin logged in successfully",
            admin: adminExist,
            token
        })
    } catch (error) {
        console.log("Error in login a admin");
        return res.status(500).json({
            message: "Error in login a admin",
            error: error.message
        })
    }
}
const logoutAdmin=(req,res)=>{
    try {
        if(!req.cookies.jwt){
            return res.status(401).json({message:"Kindly login first"})
        }
        res.clearCookie("jwt");
        return res.status(200).json({ message: "Admin logged out successfully" })
    } catch (error) {
        console.log("Error in logout admin");
        return res.status(500).json({
            message: "Error in logout admin",
            error: error.message
        })
    }
}


export {signupAdmin,loginAdmin,logoutAdmin}