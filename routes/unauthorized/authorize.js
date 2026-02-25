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
        const accessToken = jwt.sign({ id, role }, process.env.JWT_SECRET);

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
