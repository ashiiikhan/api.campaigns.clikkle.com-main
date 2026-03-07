import Queue from 'bull';
import redisConfig from '../config/redis.js';
import Automation from '../schemas/Automation.js';
import SentLog from '../schemas/SentLog.js';
import emailQueue from '../queues/emailQueue.js'; // To trigger email sending
import Contact from '../schemas/Contact.js';

const automationQueue = new Queue('automation', {
    redis: redisConfig,
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: false,
    }
});

automationQueue.process(async (job) => {
    const { automationId, contactId, nodeId, userId } = job.data;
    console.log(`Processing automation job: ${automationId} node: ${nodeId} contact: ${contactId}`);

    try {
        const automation = await Automation.findById(automationId);
        if (!automation || automation.status !== 'active') {
            console.log("Automation not found or not active");
            return;
        }

        const node = automation.workflow.nodes.find(n => n.id === nodeId);
        if (!node) {
            console.log("Node not found");
            return;
        }

        // --- Execute Node Logic ---
        if (node.type === 'action') {
            // Idempotency Check
            const existingLog = await SentLog.findOne({ automationId, contactId, nodeId });
            if (existingLog) {
                console.log("Action already executed for this node/contact. Skipping.");
                return;
            }

            // Perform Action (e.g., Send Email)
            // For MVP, assuming 'action' means 'send email'
            // In a real app, node.data would contain the action type (email, sms, etc.) and details
            
            // We need to fetch contact details to send email
            const contact = await Contact.findOne({ _id: contactId, userId });
            
            if (contact) {
                // Schedule email
                // Note: We need campaign details. For this MVP, we might need to assume a template or 
                // the node data contains subject/body. 
                // Let's assume the node.data.label is the subject for now or hardcode a welcome message
                
                await emailQueue.add({
                    to: contact.email,
                    from: { name: "Automation", email: "automation@clikkle.com" }, // Should be configurable
                    subject: "Automated Message: " + node.data.label,
                    html: "<p>This is an automated message from the builder.</p>",
                    text: "This is an automated message from the builder.",
                    campaignId: automationId, // Tracking
                    contactId: contactId,
                    provider: 'free',
                    senderAddress: "Clikkle Automation",
                    userId: userId
                });

                // Log Action
                await SentLog.create({
                    automationId,
                    contactId,
                    nodeId,
                    actionType: 'email_sent',
                    status: 'sent'
                });
            }
        }

        // --- Find Next Nodes ---
        const outgoingEdges = automation.workflow.edges.filter(e => e.source === nodeId);
        
        for (const edge of outgoingEdges) {
            const nextNodeId = edge.target;
            const nextNode = automation.workflow.nodes.find(n => n.id === nextNodeId);
            
            if (!nextNode) continue;

            if (nextNode.type === 'delay') {
                // Parse delay from label (e.g., "Wait 1 Hour")
                // Simple parsing for MVP: Check for "Hour", "Minute"
                let delay = 0;
                const label = nextNode.data.label.toLowerCase();
                if (label.includes('hour')) delay = 1000 * 60 * 60;
                else if (label.includes('minute')) delay = 1000 * 60;
                else delay = 1000 * 10; // Default 10 seconds

                // Schedule next job with delay
                // Note: The job for the delay node itself is just a pass-through that waits
                // Then it should trigger the node AFTER the delay.
                // Or simpler: Schedule the job for the *target of the delay node* with a delay?
                // No, better to schedule the DelayNode job with delay, then it processes and moves next.
                
                await automationQueue.add({
                    automationId,
                    contactId,
                    nodeId: nextNodeId,
                    userId
                }, { delay });
                console.log(`Scheduled delay node ${nextNodeId} for ${delay}ms`);

            } else {
                // Immediate execution
                await automationQueue.add({
                    automationId,
                    contactId,
                    nodeId: nextNodeId,
                    userId
                });
            }
        }

    } catch (error) {
        console.error("Automation Worker Error:", error);
    }
});

console.log('Automation Worker Started');

export default automationQueue;
