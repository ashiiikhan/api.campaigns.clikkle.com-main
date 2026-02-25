import mongoose from "mongoose";
import DataSource from "../../../classes/DataSource.js";
import Template from "../../../schemas/Template.js";

const savedTemplates = async (req, res, next) => {
	try {
		const userId = mongoose.Types.ObjectId(req.user.id);
		const dataSource = new DataSource(Template, req.query);

		const templates = await dataSource.aggregate([
			{ $match: { userId } },
		]);
		res.json({
			success: 1,
			templates,
			pageData: dataSource.pageData,
		});
	} catch (err) {
		next(err);
	}
};

export default savedTemplates;
