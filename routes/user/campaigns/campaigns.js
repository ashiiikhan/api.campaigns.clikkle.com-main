import mongoose from 'mongoose';
import DataSource from '../../../classes/DataSource.js';
import Campaign from '../../../schemas/Campaign.js';

const campaigns = async (req, res, next) => {
	try {
		const dataSource = new DataSource(Campaign, req.query);
		const campaigns = await dataSource.aggregate([
			{
				$match: {
					// EARLIER userId: '63e61a228445d1c0cb523c9c'
					userId: mongoose.Types.ObjectId(req.user.id),
				},
			},
			{ $project: { status: 1, name: 1, createdAt: 1, to: 1 } },
			{
				$lookup: {
					from: 'events',
					localField: '_id',
					foreignField: 'campaignId',
					as: 'events',
					pipeline: [
						{ $match: { name: { $in: ['Send', 'Open'] } } },
						{ $group: { _id: '$name', count: { $count: {} } } },
						{ $project: { _id: 0, count: 1, type: '$_id' } },
					],
				},
			},
		]);

		res.json({ success: 1, campaigns, pageData: dataSource.pageData });
	} catch (err) {
		next(err);
	}
};

export default campaigns;
