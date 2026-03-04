import nodemailer from 'nodemailer';
import EmailProvider from './EmailProvider.js';

class SMTPProvider extends EmailProvider {
    constructor(config) {
        super();
        this.transporter = nodemailer.createTransport({
            host: '142.251.163.108', // This is Gmail's IPv4 address
            port: 465,
            secure: true, // Default to true (SSL) for reliability
            family: 4, // Force IPv4 to prevent ENETUNREACH on Render
            tls: { 
                servername: 'smtp-relay.gmail.com', // Required for SSL when using IP host
                rejectUnauthorized: false,
                minVersion: "TLSv1.2"
             }, // Prevent ENETUNREACH on Render
            connectionTimeout: 10000, // 10 seconds
            greetingTimeout: 5000, // 5 seconds
            socketTimeout: 10000, // 10 seconds
            debug: true, // Enable debug logs
            logger: true, // Enable logger
            auth: {
                user: config.user || process.env.SMTP_USER,
                pass: config.pass || process.env.SMTP_PASS,
            }
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
