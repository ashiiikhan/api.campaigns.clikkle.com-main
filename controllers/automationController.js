import Automation from '../schemas/Automation.js';
import automationQueue from '../workers/automationWorker.js';

export const createAutomation = async (req, res) => {
  try {
    const { name, workflow, status, triggerType } = req.body;
    const userId = req.user.id;

    const automation = new Automation({
      userId,
      name,
      workflow,
      status: status || 'draft',
      triggerType
    });

    await automation.save();
    res.status(201).json({ success: true, automation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAutomations = async (req, res) => {
  try {
    const automations = await Automation.find({ userId: req.user.id });
    res.json({ success: true, automations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAutomation = async (req, res) => {
  try {
    const automation = await Automation.findOne({ _id: req.params.id, userId: req.user.id });
    if (!automation) return res.status(404).json({ success: false, message: "Automation not found" });
    res.json({ success: true, automation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// This function is called when a trigger event occurs (e.g. from another controller)
export const triggerWorkflow = async (triggerType, contactData, userId) => {
  try {
    // Find active automations with this trigger
    const automations = await Automation.find({ 
      userId, 
      status: 'active',
      // For now, we assume the first node is the trigger and we match based on type if we had it stored
      // Or we iterate and check the trigger node type
    });

    for (const automation of automations) {
        // Find the trigger node in the workflow
        const triggerNode = automation.workflow.nodes.find(n => n.type === 'trigger');
        
        // Simple check: if we had a triggerType field on the node or automation, we'd check it here
        // For this MVP, we assume any active automation runs
        if (triggerNode) {
            await automationQueue.add({
                automationId: automation._id,
                contactId: contactData._id,
                nodeId: triggerNode.id,
                contactData: contactData, // Pass initial data
                userId: userId
            });
            console.log(`Triggered automation ${automation.name} for contact ${contactData.email}`);
        }
    }
  } catch (error) {
    console.error("Error triggering workflow:", error);
  }
};
