import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../schemas/User.js"; // Import User schema

async function authenticate(req, res, next) {
    try {
        console.log("authenticating...");
        
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) throw "Token must be present";
        
        // Verify token (Use secret key in production)
        const decoded = jwt.decode(token); 
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.id) throw "Invalid token";

        // Verify user exists in DB
        const user = await User.findById(decoded.id);
        if (!user) {
            console.log("User not found in DB for ID:", decoded.id);
            return res.status(401).json({ success: 0, message: "User not found" });
        }

        req.user = {
            id: user._id,
            role: user.role || "user",
            ...user.toObject()
        };
        
        console.log("Authenticated User:", user.email);
        next();
    } catch (err) {
        console.log("Authentication error:", err);
        res.status(401).json({ success: 0, message: "Authentication failed" });
    }
}

export default authenticate;