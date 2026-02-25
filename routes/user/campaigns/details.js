import Campaign from '../../../schemas/Campaign.js';
import Tag from '../../../schemas/Tag.js';

const getCampaignDetails = async (req, res, next) => {
	try {
		const campaign = await Campaign.findById(req.params.id).populate(
			'template'
		);

		let tagDetails;
		if (campaign?.to?.id) {
			const tag = await Tag.findById(campaign.to.id);
			if (tag) {
				tagDetails = await tag.getContacts();
			}
		}

		res.json({ success: 1, data: campaign, tagDetails });
	} catch (err) {
		next(err);
	}
};

export default getCampaignDetails;
