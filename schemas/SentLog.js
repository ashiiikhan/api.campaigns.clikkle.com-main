import mongoose from "mongoose";

const sentLogSchema = new mongoose.Schema({
  automationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Automation",
    required: true,
  },
  contactId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contact",
    required: true,
  },
  nodeId: {
    type: String, // The ID of the node in the React Flow graph
    required: true,
  },
  actionType: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["sent", "failed", "skipped"],
    default: "sent",
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
});

// Compound index to ensure idempotency (one action per node per contact per automation)
sentLogSchema.index({ automationId: 1, contactId: 1, nodeId: 1 }, { unique: true });

export default mongoose.model("SentLog", sentLogSchema);
