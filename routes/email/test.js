import emailService from '../../providers/index.js';

async function testEmail(req, res, next) {
    const { to, subject, html, text, plan } = req.body;

    if (!to) {
        return res.status(400).json({ success: false, message: "Missing 'to' address" });
    }

    try {
        const result = await emailService.sendEmail({
            to,
            from: process.env.EMAIL_FROM || 'test@example.com',
            subject: subject || 'Test Email from Clikkle Campaigns',
            html: html || '<p>This is a test email.</p>',
            text: text || 'This is a test email.'
        }, plan || 'free');

        res.json({
            success: true,
            message: 'Email sent successfully',
            result
        });
    } catch (error) {
        next(error);
    }
}

export default testEmail;
