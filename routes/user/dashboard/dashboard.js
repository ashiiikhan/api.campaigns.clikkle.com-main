import Contact from "../../../schemas/Contact.js";
// import Metric from '../../../schemas/Metric.js';

async function getDashboardData(req, res, next) {
    try {
        const { id: userId } = req.user;

        const contacts = await Contact.find({ userId });
        // const metrics = await Metric.find({ userId });

        const contactSources = {
            manual: contacts.reduce(
                (count, contact) => count + +(contact.source === "manual"),
                0
            ),
            form: contacts.reduce(
                (count, contact) => count + +(contact.source === "form"),
                0
            ),
            imported: contacts.reduce(
                (count, contact) => count + +(contact.source === "imported"),
                0
            ),
        };

        const engagements = contacts.reduce(
            (counts, contact) => {
                const clicks = (contact.clicks / contact.sends) * 100;
                const opens = (contact.opens / contact.sends) * 100;

                const total = (clicks + opens) / 2;

                if (total > 70) {
                    counts.often++;
                } else if (total > 50) {
                    counts.sometimes++;
                } else {
                    counts.rarely++;
                }

                return counts;
            },
            {
                often: 0,
                sometimes: 0,
                rarely: 0,
            }
        );

        // const sends = metrics.reduce((count, { stats }) => count + stats.sends, 0);
        // const deliveries = metrics.reduce((count, { stats }) => count + stats.deliveries, 0);
        // const bounces = metrics.reduce((count, { stats }) => count + stats.bounces, 0);
        // const complaints = metrics.reduce((count, { stats }) => count + stats.complaints, 0);
        // const clicks = metrics.reduce((count, { stats }) => count + stats.clicks, 0);
        // const opens = metrics.reduce((count, { stats }) => count + stats.opens, 0);

        res.json({
            success: 1,
            contactSources,
            // sends,
            // deliveries,
            // bounces,
            // complaints,
            // clicks,
            // opens,
            engagements,
        });
    } catch (err) {
        next(err);
    }
}

export default getDashboardData;
