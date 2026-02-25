import Contact from "../../../schemas/Contact.js";
import Segment from "../../../schemas/Segment.js";

async function view(req, res, next) {
	try {
		const { id: userId } = req.user;
		const { id: segmentId } = req.params;

		console.log("segmentId", segmentId)
		console.log("userId", userId)

		const segment = await Segment.findOne({ _id: segmentId, userId });
		const contacts = await segment.getContacts(req.query);
		segment.filters = undefined;
		res.json({
			success: 1,
			segment,
			...contacts,
		});
	} catch (err) {
		next(err);
	}
}

export default view;
