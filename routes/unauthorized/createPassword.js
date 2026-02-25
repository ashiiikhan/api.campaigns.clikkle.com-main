import User from "../../schemas/User.js";

export default async function (req, res, next) {
    const { token, password } = req.body;

    try {
        const updated = await User.updateOne(
            { token },
            { $set: { password, token: "" } }
        );

        if (updated.modifiedCount) {
            res.json({
                success: 1,
                message: "Your password has been changed",
            });
        }

        res.json({
            success: 0,
            message: "invalid token",
        });
    } catch (e) {
        next(e);
    }
}
