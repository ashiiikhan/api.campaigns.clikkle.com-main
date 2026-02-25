import User from "../../../schemas/User.js";

async function allUsers(req, res, next) {
    try {
        const response = await User.find({ role: "user" });
        res.json({
            success: 1,
            data: response,
        });
    } catch (err) {
        next(err);
    }
}

export default allUsers;
