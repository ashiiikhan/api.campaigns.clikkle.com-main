// Manual trigger for testing
export const testTrigger = async (req, res) => {
    try {
        const { automationId, contactId } = req.body;
        const userId = req.user.id;

        const automation = await Automation.findOne({ _id: automationId, userId });
        if (!automation) return res.status(404).json({ success: false, message: "Automation not found" });

        // Find the trigger node
        const triggerNode = automation.workflow.nodes.find(n => n.type === 'trigger');
        if (!triggerNode) return res.status(400).json({ success: false, message: "No trigger node found in automation" });

        // Add to queue
        await automationQueue.add({
            automationId: automation._id,
            contactId: contactId, // This should be a valid contact ID
            nodeId: triggerNode.id,
            userId: userId
        });

        res.json({ success: true, message: "Automation triggered for test" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
