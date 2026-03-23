import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import EmailProvider from "./EmailProvider.js";

class SESProvider extends EmailProvider {
  constructor(config = {}) {
    super();

    this.client = new SESClient({
      region: config.region || process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: config.accessKeyId || process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey:
          config.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async send({ to, from, subject, html, text }) {

    // ✅ 1. Dynamic Footer Function
    const getFooter = (email) => {
      return `
      <hr style="margin-top:20px; border:none; border-top:1px solid #ddd;" />

      <div style="font-size:12px; color:#666; line-height:1.6;">
        You are receiving this email because ${email} subscribed.<br><br>

        <strong>Your Company</strong><br>
        Karachi, Pakistan<br><br>

        <a href="#" style="color:#007bff; text-decoration:none;">
          Unsubscribe
        </a>
      </div>
      `;
    };

    // ✅ 2. Safety check (important)
    if (!html) {
      throw new Error("HTML content is required");
    }

    // ✅ 3. Attach footer
    const footer = getFooter(to);
    const finalHtml = html + footer;

    const params = {
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: finalHtml, // ✅ footer added here
          },
          Text: {
            Charset: "UTF-8",
            Data: text || "You received this email because you signed up.",
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

      return {
        success: true,
        messageId: response.MessageId,
        provider: "ses",
      };
    } catch (error) {
      console.error("Error sending email via SES:", error);

      if (error.name === "MessageRejected") {
        console.error("SES Message Rejected:");
        console.error("- Verify sender email");
        console.error("- Verify recipient email (sandbox)");
        console.error("- Check SES production access");
      }

      throw error;
    }
  }
}

export default SESProvider;
