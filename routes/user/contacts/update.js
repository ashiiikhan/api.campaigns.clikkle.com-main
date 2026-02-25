import Contact from "../../../schemas/Contact.js";

async function update(req, res, next) {
    try {
        const { id: userId } = req.user;
        const id = req.params.id;
        const {
            firstName,
            lastName,
            email,
            address,
            phone,
            birthday,
            state,
            country,
            subscribed,
        } = req.body;
        const updated = await Contact.updateOne(
            { _id: id, userId },
            {
                firstName,
                lastName,
                email,
                address,
                phone,
                birthday,
                state,
                country,
                subscribed,
                lastUpdated: new Date(),
            }
        );
        res.json({
            success: updated.acknowledged,
            message: updated.acknowledged
                ? "Contact Updated"
                : "Failed to update contact",
        });
    } catch (err) {
        next(err);
    }
}

export default update;
