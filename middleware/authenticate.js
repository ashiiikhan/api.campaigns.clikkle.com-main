import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// DEVELOPMENT ONLY: This middleware skips token verification
// In production, you should use jwt.verify instead of jwt.decode
function authenticate(req, res, next) {
    try {
        console.log("authenticating...");
        
        // Check if Authorization header exists
        if (!req.headers.authorization) {
            console.log("No Authorization header found");
            throw "Authorization header must be present";
        }
        
        const token = req.headers.authorization.split(" ")[1];
        if (typeof token === "undefined") throw "Json token must be present";
        
        // DEVELOPMENT ONLY: Just decode the token without verifying signature
        const decoded = jwt.decode(token);
        console.log("Decoded token (without verification):", decoded);
        
        if (!decoded || !decoded.id) {
            console.log("Invalid token format, missing id");
            throw "Invalid token format";
        }
        
        // Set user object with the decoded token data
        try {
            // Try to convert to MongoDB ObjectId
            req.user = {
                id: mongoose.Types.ObjectId(decoded.id),
                role: "user"  // Default role
            };
        } catch (mongoError) {
            console.log("MongoDB ObjectId conversion error:", mongoError);
            // Fallback to using the id as a string
            req.user = {
                id: decoded.id,
                role: "user"
            };
        }
        
        console.log("authenticated :) User:", req.user);
        next();
    } catch (err) {
        console.log("Authentication error:", err);
        res.status(401).end("JWT token is not valid");
    }
}

export default authenticate;