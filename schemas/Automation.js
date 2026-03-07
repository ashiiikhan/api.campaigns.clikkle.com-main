import mongoose from "mongoose";

const automationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ["active", "draft", "paused"],
    default: "draft",
  },
  workflow: {
    type: mongoose.Schema.Types.Mixed, // Stores React Flow nodes and edges
    default: { nodes: [], edges: [] },
  },
  triggerType: {
    type: String, // e.g., 'contact_added', 'form_submission'
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Automation", automationSchema);
