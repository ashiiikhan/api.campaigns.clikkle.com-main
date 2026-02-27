
class EmailProvider {
    /**
     * Send an email
     * @param {Object} options
     * @param {string} options.to
     * @param {string} options.from
     * @param {string} options.subject
     * @param {string} options.html
     * @param {string} options.text
     * @param {Object} options.headers - Custom headers (e.g. List-Unsubscribe)
     * @returns {Promise<Object>}
     */
    async send(options) {
        throw new Error('Method "send" must be implemented');
    }
}

export default EmailProvider;
