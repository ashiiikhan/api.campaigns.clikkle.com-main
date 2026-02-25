import Tag from "../../../schemas/Tag.js";

async function viewTag(req, res, next) {
	try {
		const userId = req.user.id;
		const tagId = req.params.id;

		const tag = await Tag.findOne({ userId, _id: tagId });
		const contacts = await tag.getContacts(req.query);

		res.json({
			success: 1,
			...contacts,
		});
	} catch (err) {
		next(err);
	}
}

export default viewTag;