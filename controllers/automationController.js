import Automation from '../schemas/Automation.js';
import automationQueue from '../workers/automationWorker.js';

export async function createAutomation(req, res) {
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
}

export async function getAutomations(req, res) {
  try {
    const automations = await Automation.find({ userId: req.user.id });
    res.json({ success: true, automations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getAutomation(req, res) {
  try {
    const automation = await Automation.findOne({ _id: req.params.id, userId: req.user.id });
    if (!automation) return res.status(404).json({ success: false, message: "Automation not found" });
    res.json({ success: true, automation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateAutomation(req, res) {
  try {
    const userId = req.user.id;
    const { name, workflow, status, triggerType } = req.body;

    const automation = await Automation.findOne({ _id: req.params.id, userId });
    if (!automation) return res.status(404).json({ success: false, message: "Automation not found" });

    if (typeof name === 'string') automation.name = name;
    if (workflow) automation.workflow = workflow;
    if (status) automation.status = status;
    if (typeof triggerType === 'string') automation.triggerType = triggerType;
    automation.updatedAt = new Date();

    await automation.save();
    res.json({ success: true, automation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// This function is called when a trigger event occurs (e.g. from another controller)
export async function triggerWorkflow(triggerType, contactData, userId) {
  try {
    const automations = await Automation.find({
      userId,
      status: 'active',
      $or: [{ triggerType: null }, { triggerType }],
    });

    for (const automation of automations) {
      const triggerNode = automation.workflow?.nodes?.find((n) => n.type === 'trigger');
      if (!triggerNode) continue;

      await automationQueue.add({
        automationId: automation._id,
        contactId: contactData._id,
        nodeId: triggerNode.id,
        userId: userId
      });
      console.log(`Triggered automation ${automation.name} for contact ${contactData.email}`);
    }
  } catch (error) {
    console.error("Error triggering workflow:", error);
  }
}

// Manual trigger for testing
export async function testTrigger(req, res) {
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
}
