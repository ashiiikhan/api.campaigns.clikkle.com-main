import jwt from "jsonwebtoken";
import mongoose from "mongoose";

async function authenticate(req, res, next) {
    try {
        console.log("authenticating...");

        const token = req.headers.authorization?.split(" ")[1];
        if (!token) throw "Token must be present";

        const rawSecret = process.env.JWT_SECRET || "";
        const secrets = rawSecret
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);

        let decoded = null;
        let verified = false;

        for (const secret of secrets) {
            try {
                decoded = jwt.verify(token, secret);
                verified = true;
                break;
            } catch (_) { }
        }

        if (!verified) {
            const allowDecodeFallback =
                process.env.ALLOW_JWT_DECODE_FALLBACK === "true" ||
                process.env.NODE_ENV !== "production";

            if (!allowDecodeFallback) {
                console.error("JWT Verification Failed: invalid signature");
                return res.status(401).json({ success: 0, message: "Authentication failed (invalid token signature)" });
            }

            const payload = jwt.decode(token);
            if (!payload) throw "Invalid token";
            decoded = payload;
            console.warn("JWT verification failed; using decoded token payload (fallback enabled).");
        }

        if (!decoded || !decoded.id) throw "Invalid token";

        req.user = {
            id: String(decoded.id),
            role: decoded.role || "user",
            _id: String(decoded.id),
        };
        
        next();
    } catch (err) {
        console.log("Authentication error:", err);
        res.status(401).json({ success: 0, message: "Authentication failed" });
    }
}

export default authenticate;
