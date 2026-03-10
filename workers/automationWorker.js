import Queue from 'bull';
import redisConfig from '../config/redis.js';
import Automation from '../schemas/Automation.js';
import SentLog from '../schemas/SentLog.js';
import emailQueue from '../queues/emailQueue.js'; // To trigger email sending
import Contact from '../schemas/Contact.js';
import Campaign from '../schemas/Campaign.js';

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

        const contact = await Contact.findOne({ _id: contactId, userId });
        if (!contact) {
            console.log("Contact not found");
            return;
        }

        let conditionResult = null;
        if (node.type === 'condition') {
            const field = node.data?.condition?.field;
            const operator = node.data?.condition?.operator;
            const value = node.data?.condition?.value;
            const left = contact[field];

            if (operator === 'contains') {
                conditionResult = String(left || '').toLowerCase().includes(String(value || '').toLowerCase());
            } else {
                conditionResult = String(left ?? '').toLowerCase() === String(value ?? '').toLowerCase();
            }
        }

        if (node.type === 'action') {
            const existingLog = await SentLog.findOne({ automationId, contactId, nodeId });
            if (existingLog) {
                console.log("Action already executed for this node/contact. Skipping.");
                return;
            }

            const actionType = node.data?.actionType || 'send_email';

            if (actionType === 'send_campaign' && node.data?.campaignId) {
                const campaign = await Campaign.findOne({ _id: node.data.campaignId, userId }).populate('template');
                if (!campaign || !campaign.template) {
                    await SentLog.create({ automationId, contactId, nodeId, actionType: 'send_campaign', status: 'failed' });
                    return;
                }

                const templateMappings = campaign.templateMappings || {};
                const html = (campaign.template.templateHtml || '').replace(
                    /{{\s*(\w+)\s*}}/g,
                    (_, placeholder) => contact[templateMappings[placeholder]] || ''
                );

                await emailQueue.add({
                    to: contact.email,
                    from: campaign.from,
                    subject: campaign.subject || campaign.previewText || node.data?.subject || node.data?.label || 'Campaign',
                    html,
                    text: campaign.previewText || node.data?.text || '',
                    campaignId: campaign._id,
                    contactId: contactId,
                    provider: 'free',
                    senderAddress: "Clikkle Automation",
                    userId: userId
                });

                await SentLog.create({ automationId, contactId, nodeId, actionType: 'send_campaign', status: 'sent' });
            } else {
                await emailQueue.add({
                    to: contact.email,
                    from: { name: "Automation", email: "automation@clikkle.com" },
                    subject: node.data?.subject || node.data?.label || "Automated Message",
                    html: node.data?.html || "<p>This is an automated message.</p>",
                    text: node.data?.text || "This is an automated message.",
                    campaignId: automationId,
                    contactId: contactId,
                    provider: 'free',
                    senderAddress: "Clikkle Automation",
                    userId: userId
                });

                await SentLog.create({ automationId, contactId, nodeId, actionType: 'send_email', status: 'sent' });
            }
        }

        // --- Find Next Nodes ---
        const outgoingEdges = automation.workflow.edges.filter(e => e.source === nodeId);
        const edgesToFollow = node.type === 'condition'
            ? outgoingEdges.filter((e) => String(e.data?.branch || e.label || '').toLowerCase() === (conditionResult ? 'true' : 'false'))
            : outgoingEdges;
        
        for (const edge of edgesToFollow) {
            const nextNodeId = edge.target;
            const nextNode = automation.workflow.nodes.find(n => n.id === nextNodeId);
            
            if (!nextNode) continue;

            if (nextNode.type === 'delay') {
                let delay = Number(nextNode.data?.delayMs);
                if (!Number.isFinite(delay) || delay < 0) {
                    const label = String(nextNode.data?.label || '').toLowerCase();
                    if (label.includes('hour')) delay = 1000 * 60 * 60;
                    else if (label.includes('minute')) delay = 1000 * 60;
                    else delay = 1000 * 10;
                }
                
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
