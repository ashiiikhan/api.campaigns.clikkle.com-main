import jwt from "jsonwebtoken";
import User from "../../schemas/User.js";

async function authorize(req, res, next) {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({
            username,
            password,
        });

        if (!user) {
            throw new Error("Username or password is incorrect");
        }

        if (!user.isVerified) {
            throw new Error("Email is not verified");
        }

        const { id, role } = user;
        // Ensure secret key is used or fallback for dev
        const secret = process.env.JWT_SECRET || 'secret'; 
        const accessToken = jwt.sign({ id, role }, secret);

        user.password = undefined;
        user.__v = undefined;

        res.json({
            success: 1,
            accessToken,
            user,
        });
    } catch (err) {
        next(err);
    }
}

export default authorize;
