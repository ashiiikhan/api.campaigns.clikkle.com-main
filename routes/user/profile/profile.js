import User from "../../../schemas/User.js";

async function getProfile(req, res, next) {
    try {
        const { id } = req.user;
        const user = await User.findOne({ _id: id });
        user.password = undefined;
        user.__v = undefined;
        res.json({
            success: 1,
            user,
        });
    } catch (err) {
        next(err);
    }
}

export default getProfile;
