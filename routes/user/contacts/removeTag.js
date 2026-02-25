import Contact from "../../../schemas/Contact.js";

export default async function (req, res, next) {
    console.log("API Hit");
    const { tagId, contactIds } = req.body;
    console.log({ tagId, contactIds });
    const userId = req.user.id;
    try {
        const updated = await Contact.updateMany(
            { userId, _id: { $in: contactIds } },
            {
                $pull: {
                    tags: tagId,
                },
            }
        );

        res.json({
            success: updated.acknowledged,
            modified: updated.modifiedCount,
        });
    } catch (e) {
        next(e);
    }
}
