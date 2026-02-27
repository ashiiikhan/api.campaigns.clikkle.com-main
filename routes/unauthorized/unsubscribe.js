import Contact from "../../schemas/Contact.js";

async function unsubscribe(req, res, next) {
    try {
        const { token } = req.params;
        if (!token) return res.status(400).send("Invalid unsubscribe link");

        let decoded;
        try {
            const jsonStr = Buffer.from(token, 'base64').toString('utf-8');
            decoded = JSON.parse(jsonStr);
        } catch (e) {
            return res.status(400).send("Invalid unsubscribe token");
        }

        const { c: contactId, cmp: campaignId } = decoded;

        if (!contactId) return res.status(400).send("Invalid contact identifier");

        // Update contact
        await Contact.findByIdAndUpdate(contactId, {
            subscribed: false,
            lastChanged: new Date()
        });

        // TODO: Add to suppression list if separate schema exists
        // TODO: Log unsubscribe event for campaign analytics

        // Return a simple confirmation page
        res.send(`
            <html>
                <head>
                    <title>Unsubscribed</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding-top: 50px; }
                        .container { max-width: 600px; margin: 0 auto; }
                        h1 { color: #333; }
                        p { color: #666; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>You have been unsubscribed</h1>
                        <p>You will no longer receive emails from this list.</p>
                    </div>
                </body>
            </html>
        `);

    } catch (error) {
        next(error);
    }
}

export default unsubscribe;
