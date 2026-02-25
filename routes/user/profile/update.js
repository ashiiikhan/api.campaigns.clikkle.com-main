import User from "../../../schemas/User.js";

async function updateProfile(req, res, next) {
    try {
        const { id } = req.user;
        const { firstName, lastName, username, email, phone, address } =
            req.body;
        const updated = await User.updateOne(
            { _id: id },
            {
                firstName,
                lastName,
                username,
                email,
                phone,
                address,
            }
        );
        res.json({
            success: updated.matchedCount && updated.acknowledged,
            message:
                updated.matchedCount && updated.acknowledged
                    ? updated.modifiedCount
                        ? "User Updated successfully"
                        : "No Change to user"
                    : "Failed to update user",
        });
    } catch (err) {
        next(err);
    }
}

export default updateProfile;
