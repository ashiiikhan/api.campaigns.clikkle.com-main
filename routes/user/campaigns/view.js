import Campaign from "../../../schemas/Campaign.js";

async function viewCampaign(req, res, next) {
	try {
		const campaign = await Campaign.findById(req.params.id);
		if (!campaign) throw new Error("Campaign not found");

		res.json({ success: 1, data: campaign, });
	} catch (err) {
		next(err);
	}
}

export default viewCampaign;
