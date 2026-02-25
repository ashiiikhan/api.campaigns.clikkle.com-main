import Contact from "../../../schemas/Contact.js";
import Tag from "../../../schemas/Tag.js";

async function deleteTag(req, res, next) {
    try {
        const { id: userId } = req.user;
        const { ids: bodyTags } = req.body;
        const filters = {
            userId,
            _id: Array.isArray(bodyTags) ? { $in: bodyTags } : bodyTags,
        };

        const tags = await Tag.find(filters);
        const tagIds = tags.map((tag) => tag._id);

        const contactsUpdated = await Contact.updateMany(
            { userId, tags: { $in: tagIds } },
            { $pull: { tags: { $in: tagIds } } }
        );

        if (!contactsUpdated.acknowledged)
            throw new Error("Cannot delete tags");

        const deleted = await Tag.deleteMany(filters);

        res.json({
            success: deleted.acknowledged,
            message: `${deleted.deletedCount} Deleted`,
        });
    } catch (err) {
        next(err);
    }
}

export default deleteTag;
