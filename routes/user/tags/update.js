import Contact from '../../../schemas/Contact.js';
import Tag from '../../../schemas/Tag.js';

async function updateTag(req, res, next) {
	try {
		const { id: userId } = req.user;
		const { id, name } = req.body;

		await Tag.updateOne({ userId, _id: id }, { name }, { runValidators: true });

		res.json({
			success: 1,
			message: `Name updated to ${name}`,
		});
	} catch (err) {
		next(err);
	}
}

export default updateTag;
