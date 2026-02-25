import chalk from "chalk";
import Campaign from "../../schemas/Campaign.js";
import Contact from "../../schemas/Contact.js";
// import Report from '../../schemas/Report.js';
// import Metric from '../../schemas/Metric.js';
import Event from "./../../schemas/Event.js";

async function mails(req, res, next) {
    // Parsing message is compulsory
    req.body.Message = JSON.parse(req.body.Message);
    const message = req.body.Message;
    const { eventType, mail } = message;
    const { messageId, destination } = mail;
    const campaign = await Campaign.findOne({ messageId });
    const userId = campaign.userId;
    const campaignId = campaign._id;

    console.log({ message, mail });

    destination.forEach(async (email) => {
        try {
            const contact = await Contact.findOne({ email, userId });
            const contactId = contact.id;
            const event = new Event({
                name: eventType,
                campaignId,
                contactId,
                userId,
            });
            await event.save();
        } catch (e) {
            console.log(e);
        }
    });

    res.end();
}

export default mails;
