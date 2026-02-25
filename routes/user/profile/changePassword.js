import User from "../../../schemas/User.js";

async function changePassword(req, res, next) {
    try {
        const { id } = req.user;
        const { newPassword, oldPassword } = req.body;
        const updated = await User.updateOne(
            {
                _id: id,
                password: oldPassword,
            },
            {
                password: newPassword,
            }
        );
        res.json({
            success: updated.modifiedCount,
            message: updated.matchedCount
                ? updated.modifiedCount
                    ? "Password updated"
                    : "Cannot update password"
                : "Password Don't match",
        });
    } catch (err) {
        next(err);
    }
}

export default changePassword;
