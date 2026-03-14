import Automation from '../schemas/Automation.js';
import automationQueue from '../workers/automationWorker.js';
import Contact from '../schemas/Contact.js';
import mongoose from 'mongoose';

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

        const triggerNode = automation.workflow.nodes.find(n => n.type === 'trigger');
        if (!triggerNode) return res.status(400).json({ success: false, message: "No trigger node found in automation" });

        let resolvedContactId = contactId;
        if (!resolvedContactId) {
            const latestContact = await Contact.findOne({ userId }).sort({ dateAdded: -1, _id: -1 });
            if (!latestContact) {
                console.log('test-trigger: no contactId provided and no contacts found for userId:', userId);
                return res.status(404).json({ success: false, message: "No contacts found for this user" });
            }
            resolvedContactId = latestContact._id.toString();
            console.log('test-trigger: auto-picked most recent contactId:', resolvedContactId);
        }

        if (!mongoose.Types.ObjectId.isValid(resolvedContactId)) {
            console.log('test-trigger: invalid contactId format:', resolvedContactId);
            return res.status(400).json({ success: false, message: "Invalid contactId" });
        }

        const contactQuery = { _id: mongoose.Types.ObjectId(resolvedContactId), userId: mongoose.Types.ObjectId(userId) };
        console.log('test-trigger: contactQuery:', contactQuery);

        const contact = await Contact.findOne(contactQuery);
        if (!contact) {
            const exists = await Contact.findById(resolvedContactId);
            if (!exists) {
                console.log('test-trigger: contact not found because ID does not exist:', resolvedContactId);
                return res.status(404).json({ success: false, message: "Contact not found (ID does not exist)" });
            }
            console.log('test-trigger: contact exists but userId does not match. contact.userId:', String(exists.userId), 'auth.userId:', String(userId));
            return res.status(403).json({ success: false, message: "Contact not found for this user (userId mismatch)" });
        }

        await automationQueue.add({
            automationId: automation._id,
            contactId: resolvedContactId,
            nodeId: triggerNode.id,
            userId: userId
        });

        res.json({ success: true, message: "Automation triggered for test" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
