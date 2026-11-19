import jwt from "jsonwebtoken"

const adminMiddleware=(req,res,next)=>{
    const authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({error:"no token provided"})
    }
    const token=authHeader.split(" ")[1]
    try {
        const decoded=jwt.verify(token,process.env.JWT_ADMIN_PASSWORD);
        req.adminId=decoded.id;
        next()
    } catch (error) {
        console.log("Invalid token or token is expired");
        return res.status(401).json({
            message:"Token is invalid or expired",
            error:error.message
        })
    }
}

export default adminMiddleware;