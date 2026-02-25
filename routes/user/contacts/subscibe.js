import Contact from "../../../schemas/Contact.js";

async function subscribeContacts(req, res, next) {
    try {
        const { id: userId } = req.user;
        const { ids } = req.body;
        const updated = await Contact.updateMany(
            { _id: { $in: ids }, userId },
            { $set: { subscribed: true, dateSubscribed: new Date() } }
        );
        res.json({
            success: updated.acknowledged,
            message: `${updated.modifiedCount} contacts subscribed`,
        });
    } catch (err) {
        next(err);
    }
}

export default subscribeContacts;
