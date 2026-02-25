import Template from "../../../schemas/Template.js";

const view = async (req, res, next) => {
	try {
		const templateId = req.params.id;
		if (!templateId) throw new Error("Template ID is required");
		const template = await Template.findById(templateId);
		res.json({ success: 1, template });
	} catch (err) {
		next(err);
	}
};

export default view;
