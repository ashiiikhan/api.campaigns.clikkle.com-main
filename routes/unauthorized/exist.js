import User from "../../schemas/User.js";

async function userExist(req, res, next) {
    try {
        const { email, username } = req.body;
        const filters = {};
        if (email) {
            filters.email = email;
        } else if (username) {
            filters.username = username;
        } else {
            throw "Must Specify username or email";
        }
        const doesExist = Boolean(await User.exists(filters));
        res.json({
            success: 1,
            exist: doesExist,
        });
    } catch (err) {
        next(err);
    }
}

export default userExist;
