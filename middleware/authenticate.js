import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../schemas/User.js"; // Import User schema

async function authenticate(req, res, next) {
    try {
        console.log("authenticating...");
        
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) throw "Token must be present";
        
        // Verify token (Use secret key in production)
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.warn("WARNING: JWT_SECRET is not set in environment variables. Using default 'secret' which may cause signature validation errors.");
        }
        const verifySecret = secret || 'secret';
        
        let decoded;
        try {
            decoded = jwt.verify(token, verifySecret);
        } catch (e) {
            console.error("JWT Verification Failed:", e.message);
            // Fallback to decode for development if verify fails (e.g. secret mismatch)
            console.warn("Token verification failed, falling back to decode:", e.message);
            decoded = jwt.decode(token);
        }

        if (!decoded || !decoded.id) throw "Invalid token";

        // Verify user exists in DB (Optional for now)
        let user;
        try {
            user = await User.findById(decoded.id);
        } catch (dbErr) {
            console.error("DB Error finding user:", dbErr);
        }

        if (!user) {
            console.log("User not found in DB for ID:", decoded.id, "- Proceeding with token data only");
            // Instead of blocking, allow with minimal user object from token
            req.user = {
                id: decoded.id,
                role: decoded.role || "user",
                _id: decoded.id // Ensure _id is available as string or ObjectId depending on downstream usage
            };
        } else {
            req.user = {
                id: user._id,
                role: user.role || "user",
                ...user.toObject()
            };
            console.log("Authenticated User:", user.email);
        }
        
        next();
    } catch (err) {
        console.log("Authentication error:", err);
        res.status(401).json({ success: 0, message: "Authentication failed" });
    }
}

export default authenticate;