import Campaign from "../../../schemas/Campaign.js";

async function create(req, res, next) {
	try {
		const { id: userId } = req.user;
		const campaign = new Campaign({ userId });
		await campaign.save();

		res.json({
			success: 1,
			id: campaign.id,
			name: campaign.name,
		});
	} catch (err) {
		next(err);
	}
}

export default create;
