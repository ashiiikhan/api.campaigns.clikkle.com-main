import Template from '../../../schemas/Template.js';

async function create(req, res, next) {
	try {
		const templateId = req.params.id;
		const updated = await Template.findByIdAndUpdate(templateId, {
			$set: {
				templateJson: req.body.templateJson,
				templateHtml: req.body.templateHtml,
				placeholders: req.body.placeholders,
			},
		});

		res.json({
			success: updated.acknowledged,
			message: `Template updated successfully`,
		});
	} catch (err) {
		next(err);
	}
}

export default create;
