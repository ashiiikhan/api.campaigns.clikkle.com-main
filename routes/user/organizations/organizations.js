import mongoose from 'mongoose';
import DataSource from '../../../classes/DataSource.js';
import Organization from "../../../schemas/Organization.js";

const organizations = async (req, res, next) => {
	try {
		const userId = mongoose.Types.ObjectId(req.user.id);
		const dataSource = new DataSource(Organization, req.query);
		const organizations = await dataSource.find({ userId });
		res.json({
			success: 1,
			organizations,
			pageData: dataSource.pageData,
		});
	} catch (err) {
		next(err);
	}
};

export default organizations;
