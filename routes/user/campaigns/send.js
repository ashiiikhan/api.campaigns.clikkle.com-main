import Campaign from '../../../schemas/Campaign.js';
import Segment from '../../../schemas/Segment.js';
import Tag from '../../../schemas/Tag.js';
import User from '../../../schemas/User.js'; // Import User schema
import { pushNotification } from '../../../utilities/functions.js';
import emailQueue from '../../../queues/emailQueue.js';

async function send(req, res, next) {
	try {
		const userId = req.user.id;
		const user = await User.findById(userId); // Fetch User
		if (!user) throw new Error('User not found');
		
		const campaignId = req.params.id;

		const campaign = await Campaign.findOne({
			userId,
			_id: campaignId,
			status: 'draft',
		}).populate('template');
		if (!campaign) throw new Error('Campaign not found');

		if (!(campaign.to.type && campaign.to.id && campaign.to.name)) {
			throw new Error('Please select your audience');
		} else if (!campaign.from.name || !campaign.from.email) {
			throw new Error('Please select who is sending this campaign');
		} else if (!(campaign.subject && campaign.previewText)) {
			throw new Error('Please select the subject and preview text');
		} else if (!campaign.template) {
			throw new Error('Please design your email first');
		}

		const contacts = [];

		if (campaign.to.type === 'tag') {
			const tagId = campaign.to.id;
			const tag = await Tag.findOne({ userId, _id: tagId });
			const allContacts = await tag.getContacts();
			contacts.push(...allContacts.contacts);
		} else {
			const segmentId = campaign.to.id;
			const segment = await Segment.findOne({ _id: segmentId, userId });
			contacts.push(...(await segment.getContacts()).contacts);
		}

		console.log(`Found ${contacts.length} contacts for campaign ${campaignId}`);

		const templateMappings = campaign.templateMappings;
		try {
			for (let i = 0; i < contacts.length; i++) {
				await emailQueue.add({
					to: contacts[i].email || contacts[i], // Ensure email is passed
					from: campaign.from,
					subject: campaign.subject || campaign.previewText,
					html: campaign.template.templateHtml.replace(
						/{{\s*(\w+)\s*}}/g,
						(_, placeholder) => contacts[i][templateMappings[placeholder]] || ''
					),
					text: campaign.previewText,
					campaignId: campaignId,
					contactId: contacts[i]._id,
					provider: 'free', // Or determine based on user plan
					senderAddress: user.address, // Pass address for GDPR footer
					userId: userId
				});
			}
		} catch (error) {
			console.error("Queue Error:", error);
			throw new Error("Failed to queue emails. Please ensure the email service is configured correctly.");
		}

		// bugFix
		// Implement RabbitMQ
		// const channel, connection =
		// for (const contact of contacts) {
		// 	try {
		// 		await channel.sendToQueue(
		// 			'emails',
		// 			Buffer.from(
		// 				JSON.stringify({
		// 					contactId: contact._id,
		// 					campaignId: campaignId,
		// 				})
		// 			)
		// 		);
		// 		console.log(`Message Queued for ${contact.firstName}`);
		// 	} catch (e) {
		// 		console.error(e);
		// 	}
		// }

		campaign.status = 'ongoing';
		await campaign.save();

		await pushNotification({
			userId,
			type: 'campaign',
			title: 'New campaign scheduled',
			description: `A new campaign ${campaign.name} has been scheduled to send`,
		});

		res.json({ success: 1 });
	} catch (err) {
		next(err);
	}
}

export default send;
