import SMTPProvider from './SMTPProvider.js';
import SESProvider from './SESProvider.js';
import ResendProvider from './ResendProvider.js';

class EmailService {
    constructor() {
        this.providers = {
            smtp: new SMTPProvider({}),
            ses: new SESProvider({}),
            resend: new ResendProvider()
        };
    }

    /**
     * Get the appropriate provider based on user plan or configuration
     * @param {string} plan - 'free', 'paid', etc.
     * @returns {EmailProvider}
     */
    getProvider(plan = 'free') {
        if (plan === 'free' || plan === 'smtp') {
            return this.providers.resend;
        } else {
            // Default to SES for paid plans, or fallback to SMTP if SES fails/not configured?
            // For now, sticking to requirements: Paid -> SES
            return this.providers.ses;
        }
    }

    async sendEmail(options, plan = 'free') {
        const provider = this.getProvider(plan);
        return await provider.send(options);
    }
}

const emailService = new EmailService();
export default emailService;
