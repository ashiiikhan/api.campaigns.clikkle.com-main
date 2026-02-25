import Template from "../../../schemas/Template.js";

async function create(req, res, next) {
	const { name } = req.body;
	const userId = req.user.id;
	try {
		const template = new Template({ userId, name });
		await template.save();

		res.json({
			success: 1,
			templateId: template.id,
			message: `Template '${name}' created successfully`,
		});
	} catch (err) {
		next(err);
	}
}

export default create;
