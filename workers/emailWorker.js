import emailQueue from '../queues/emailQueue.js';
import emailService from '../providers/index.js';
import Campaign from '../schemas/Campaign.js';
import Contact from '../schemas/Contact.js'; // Assuming you might need to update contact status

// Worker Process
emailQueue.process(async (job) => {
    const { to, from, subject, html, text, campaignId, contactId, provider, senderAddress } = job.data;

    console.log(`Processing email job ${job.id} for ${to} (Provider: ${provider})`);

    try {
        // Generate Unsubscribe Token and Link
        const token = Buffer.from(JSON.stringify({ c: contactId, cmp: campaignId })).toString('base64');
        const unsubscribeDomain = process.env.UNSUBSCRIBE_DOMAIN || 'https://unsubscribe.campaigns.clikkle.com';
        const unsubscribeLink = `${unsubscribeDomain}/u/${token}`;

        // Construct GDPR Footer
        const footerHtml = `
            <br/><br/>
            <hr/>
            <p style="font-size: 12px; color: #666;">
                You are receiving this email because you subscribed to our list.<br/>
                <b>Our Address:</b> ${senderAddress || 'Not Provided'}<br/>
                <a href="${unsubscribeLink}">Unsubscribe</a>
            </p>
        `;

        const finalHtml = html + footerHtml;

        // Prepare Headers (List-Unsubscribe)
        const headers = {
            'List-Unsubscribe': `<mailto:unsubscribe@${new URL(unsubscribeDomain).hostname}>, <${unsubscribeLink}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
        };

        const result = await emailService.sendEmail({
            to,
            from: `"${from.name}" <${from.email}>`,
            subject,
            html: finalHtml,
            text: text + `\n\nUnsubscribe: ${unsubscribeLink}`,
            headers
        }, provider || 'free');

        console.log(`Email sent to ${to} via ${result.provider}`);

        return result;

    } catch (error) {
        console.error(`Failed to send email to ${to}:`, error);
        throw error; // Triggers retry
    }
});

emailQueue.on('completed', (job, result) => {
    console.log(`Job ${job.id} completed! Result:`, result);
});

emailQueue.on('failed', (job, err) => {
    console.log(`Job ${job.id} failed! Error:`, err);
});

console.log('Email Worker Started');

export default emailQueue;
