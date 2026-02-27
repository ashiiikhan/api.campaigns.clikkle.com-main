import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import EmailProvider from './EmailProvider.js';

class SESProvider extends EmailProvider {
    constructor(config = {}) {
        super();
        this.client = new SESClient({
            region: config.region || process.env.AWS_REGION || "us-east-1",
            credentials: {
                accessKeyId: config.accessKeyId || process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: config.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY,
            }
        });
    }

    async send({ to, from, subject, html, text, headers }) {
        // TODO: Use SendRawEmailCommand to support custom headers like List-Unsubscribe
        const params = {
            Destination: {
                ToAddresses: [to],
            },
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: html,
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: text || "",
                    },
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: subject,
                },
            },
            Source: from,
        };

        try {
            const command = new SendEmailCommand(params);
            const response = await this.client.send(command);
            console.log("Message sent via SES:", response.MessageId);
            return { success: true, messageId: response.MessageId, provider: 'ses' };
        } catch (error) {
            console.error("Error sending email via SES:", error);
            throw error;
        }
    }
}

export default SESProvider;
