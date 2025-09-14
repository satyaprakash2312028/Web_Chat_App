import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import User from "../models/user.model.js";
dotenv.config();
export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token) return res.status(401).json({message: "Unauthorized Access - No token provided"});
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) return res.status(401).json({message: "Unauthorized Access - Invalid Token"});
        const user = await User.findById(decoded.userId).select("-password");
        if(!user) return res.status(404).json({message: "User Not Found"});
        req.user = user;
        next();
    } catch (error) {
        console.log("Error in auth middleware ", error);
    }
};
export const requiresVerified = (req, res, next) => {
    try {
        if(!req.user.isVerified) return res.status(403).json({message: "Verify your email account first"});
        next();
    } catch (error) {
        console.log("Error in requiresVerified middleware", error);
    }
}