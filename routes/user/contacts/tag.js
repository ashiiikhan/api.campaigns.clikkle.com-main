import Contact from "../../../schemas/Contact.js";
import Tag from "../../../schemas/Tag.js";

async function tagContacts(req, res, next) {
    try {
        const { tags, contacts } = req.body;
        const { id: userId } = req.user;

        if (!(await Tag.existsAll(tags))) {
            throw new Error("Tags doest not exist");
        }

        const updated = await Contact.updateMany(
            { userId, _id: { $in: contacts } },
            { $addToSet: { tags: { $each: tags } } }
        );

        const tagsUpdated = await Tag.updateMany(
            { userId, _id: { $in: tags } },
            { $inc: { contacts: updated.modifiedCount } }
        );

        res.json({
            success: updated.acknowledged && tagsUpdated.acknowledged,
            message: `${tags.length} added to ${updated.modifiedCount} Contacts`,
        });
    } catch (err) {
        next(err);
    }
}

export default tagContacts;
