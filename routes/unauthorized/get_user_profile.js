import User from "../../schemas/User.js";

async function get_user_profile(req, res, next) {
    const { email } = req.body;

    console.log("get_user_profile", email);

        const user = await User.findOne({ email: email });

        res.json({
            success: 1,
            user,
        });
}

export default get_user_profile;