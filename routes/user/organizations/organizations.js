import DataSource from '../../../classes/DataSource.js';
import Organization from "../../../schemas/Organization.js";

const organizations = async (req, res, next) => {
	try {
		const userId = req.user.id;
        console.log("userId--------------------->", userId);
		const dataSource = new DataSource(Organization, req.query);
        console.log("dataSource--------------------->", dataSource);
		const organizations = await dataSource.find({ userId });
        console.log("organizations--------------------->", organizations);
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