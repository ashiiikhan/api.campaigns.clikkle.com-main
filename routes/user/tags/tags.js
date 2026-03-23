import mongoose from 'mongoose';
import DataSource from '../../../classes/DataSource.js';
import Tag from '../../../schemas/Tag.js';

const tags = async (req, res, next) => {
	try {
		const userId = mongoose.Types.ObjectId(req.user.id);
		const dataSource = new DataSource(Tag, req.query);

		const tags = await dataSource.find({ userId });
		res.json({
			success: 1,
			tags,
			pageData: dataSource.pageData,
		});
	} catch (err) {
		next(err);
	}
};

export default tags;
