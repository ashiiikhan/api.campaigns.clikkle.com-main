import mongoose from 'mongoose';
import Contact from '../../../schemas/Contact.js';
import Tag from '../../../schemas/Tag.js';
import { flattern } from '../../../utilities/functions.js';

async function contactsDashboard(req, res, next) {
	try {
		const { id: userId } = req.user;
		const prevMonthTime = new Date();
		prevMonthTime.setTime(
			prevMonthTime.getTime() - 30 * 24 * 60 * 60 * 1000
		);

		const sources = flattern(
			await Contact.aggregate([
				{ $match: { userId } },
				{ $group: { _id: '$source', count: { $count: {} } } },
			]),
			'_id',
			'count'
		);

		const subscribed = flattern(
			await Contact.aggregate([
				{
					$match: {
						userId,
						dateAdded: { $gte: prevMonthTime },
					},
				},
				{
					$group: {
						_id: '$subscribed',
						count: {
							$count: {},
						},
					},
				},
			]),
			'_id',
			'count'
		);

		const tags = await Tag.find({ userId })
			.sort({ contacts: -1 })
			.limit(6)
			.select('name contacts');

		const engagement = flattern(
			await Contact.aggregate([
				{
					$match: {
						userId,
					},
				},
				{
					$group: {
						_id: '$engagement',
						count: { $count: {} },
					},
				},
			]),
			'_id',
			'count'
		);

		const rarelyEngaged = engagement.rarely || 0;
		const sometimesEngaged = engagement.sometimes || 0;
		const oftenEngaged = engagement.often || 0;
		const total = rarelyEngaged + oftenEngaged + sometimesEngaged;

		const response = {
			success: 1,
			newContacts: {
				subscribed: subscribed.true || 0,
				unsubscribed: subscribed.false || 0,
			},
			tags,
			sources: { manual: 0, imported: 0, form: 0, ...sources },
			engagementPercents: {
				rarely: (rarelyEngaged / total) * 100,
				sometimes: (sometimesEngaged / total) * 100,
				often: (oftenEngaged / total) * 100,
			},
		};

		res.json(response);
	} catch (err) {
		next(err);
	}
}

export default contactsDashboard;
