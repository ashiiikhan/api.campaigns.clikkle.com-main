import DataSource from "../../../classes/DataSource.js";
import Template from "../../../schemas/Template.js";

const templatesForSale = async (req, res, next) => {
	try {
		const userId = undefined;
		const dataSource = new DataSource(Template, req.query);

		const templates = await dataSource.aggregate([
			{ $match: { userId } },
		]);

		res.json({
			success: 1,
			templates: templates,
			pageData: dataSource.pageData,
		});
	} catch (err) {
		next(err);
	}
};

export default templatesForSale;
