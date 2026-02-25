import Campaign from '../../../schemas/Campaign.js';

async function update(req, res, next) {
	// const { id: userId } = req.user;
	const campaignId = req.params.id;
	const { name, to, from, subject, previewText, content, templateMappings } =
		req.body;

	try {
		const campaign = await Campaign.findById(campaignId);
		if (!campaign) return new Error('Campaign not found');

		if (campaign.status === 'completed') {
			return new Error('Cannot edit, campaign is completed already');
		}

		if (campaign.status === 'ongoing' && typeof to !== 'undefined') {
			return new Error('Cannot edit audience when campaign is ongoing');
		}

		const updated = await Campaign.findByIdAndUpdate(campaignId, {
			$set: { to, name, from, subject, previewText, content, templateMappings },
		});

		res.json({
			success: !!updated,
			message: updated.modifiedCount ? 'Campaign updated' : 'No change',
		});
	} catch (err) {
		next(err);
	}
}

export default update;
