import Campaign from '../../../schemas/Campaign.js';
import Template from '../../../schemas/Template.js';

async function selectTemplate(req, res, next) {
	try {
		const template = await Template.findById(req.body.templateId);
		if (!template) throw new Error('Template not found');

		const updated = await Campaign.updateOne(
			{
				userId: req.user.id,
				_id: req.params.id,
				status: 'draft',
			},
			{ $set: { template: template._id } }
		);

		res.json({
			success: updated.acknowledged && updated.modifiedCount,
		});
	} catch (err) {
		next(err);
	}
}

export default selectTemplate;
