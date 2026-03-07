import SESProvider from './SESProvider.js';

class EmailService {
    constructor() {
        this.providers = {
            ses: new SESProvider({})
        };
    }

    /**
     * Get the appropriate provider based on user plan or configuration
     * @param {string} plan - 'free', 'paid', etc.
     * @returns {EmailProvider}
     */
    getProvider(plan = 'free') {
        // Return SES provider for all plans as requested
        return this.providers.ses;
    }

    async sendEmail(options, plan = 'free') {
        const provider = this.getProvider(plan);
        return await provider.send(options);
    }
}

const emailService = new EmailService();
export default emailService;
