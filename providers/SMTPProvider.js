import nodemailer from 'nodemailer';
import EmailProvider from './EmailProvider.js';

class SMTPProvider extends EmailProvider {
    constructor(config) {
        super();
        this.transporter = nodemailer.createTransport({
            host: config.host || process.env.SMTP_HOST,
            port: config.port || process.env.SMTP_PORT,
            secure: config.secure || (process.env.SMTP_SECURE === 'true'), // true for 465, false for other ports
            family: 4, // Force IPv4 to prevent ENETUNREACH on Render
            tls: { rejectUnauthorized: false }, // Prevent ENETUNREACH on Render
            auth: {
                user: config.user || process.env.SMTP_USER,
                pass: config.pass || process.env.SMTP_PASS,
            },
        });
        
        console.log(`SMTP Provider initialized with host: ${this.transporter.options.host}, port: ${this.transporter.options.port}, secure: ${this.transporter.options.secure}`);
    }

    async send({ to, from, subject, html, text, headers }) {
        try {
            const info = await this.transporter.sendMail({
                from,
                to,
                subject,
                text,
                html,
                headers // Nodemailer supports this directly
            });
            console.log("Message sent: %s", info.messageId);
            return { success: true, messageId: info.messageId, provider: 'smtp' };
        } catch (error) {
            console.error("Error sending email via SMTP:", error);
            throw error;
        }
    }
}

export default SMTPProvider;
