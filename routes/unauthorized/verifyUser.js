import invalidTokenPage from "../../pages/invalidToken.js";
import User from "../../schemas/User.js";
import verifiedPage from "./../../pages/verified.js";

async function verifyUser(req, res, next) {
    const token = req.params.token;

    try {
        const updated = await User.updateOne(
            { token },
            { $set: { isVerified: true, token: "" } }
        );

        if (!updated.modifiedCount) {
            return res.end(invalidTokenPage);
        }

        res.end(verifiedPage);
    } catch (e) {
        next(e);
    }
}

export default verifyUser;
