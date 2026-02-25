import Contact from "../../../schemas/Contact.js";

async function unsubscribeContacts(req, res, next) {
    try {
        const { id: userId } = req.user;
        const { ids } = req.body;
        const updated = await Contact.updateMany(
            { _id: { $in: ids }, userId },
            { $set: { subscribed: false } }
        );
        res.json({
            success: updated.acknowledged,
            message: `${updated.modifiedCount} contacts unsubscribed`,
        });
    } catch (err) {
        next(err);
    }
}

export default unsubscribeContacts;
