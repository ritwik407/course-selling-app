import mongoose from "mongoose";

const connectDB=async(URI)=>{
    try {
        await mongoose.connect(URI);
        console.log("Connected to the database");
    } catch (error) {
        console.log("Database is not connected",error);
    }
}

export default connectDB;