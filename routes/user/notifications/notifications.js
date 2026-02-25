import Notification from "../../../schemas/Notification.js";

async function getNotifications(req, res, next) {
    try {
        const userId = req.user.id;
        const notifications = await Notification.find({ userId })
            .sort({ date: -1 })
            .limit(4);
        res.json({
            success: 1,
            notifications,
        });
    } catch (err) {
        next(err);
    }
}

export default getNotifications;
