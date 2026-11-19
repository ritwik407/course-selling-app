import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import fileUpload from "express-fileupload";
import {v2 as cloudinary} from "cloudinary"
import cookieParser from "cookie-parser";
import connectDB from "./database/connectDB.js";
import courseRouter from "./routes/course.route.js";
import userRouter from "./routes/user.route.js";
import adminRouter from "./routes/admin.route.js";

dotenv.config({path:"./config/.env"});
const app=express();

const port=process.env.PORT || 3000;
const Mongo_URI=process.env.Mongo_URI;


app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials:true,
  methods: ["GET","PUT","POST","DELETE"],
  allowedHeaders:["Content-Type","Authorization"],
}
))
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.use("/api/v1/course",courseRouter);
app.use("/api/v1/user",userRouter);
app.use("/api/v1/admin",adminRouter);

cloudinary.config({
    cloud_name:process.env.cloud_name,
    api_key:process.env.api_key,
    api_secret:process.env.api_secret
})

connectDB(Mongo_URI);

app.listen(port,()=>{
    console.log("Server is running on PORT",port);
})