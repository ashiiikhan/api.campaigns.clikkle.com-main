import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, required: true },
  type: {
    type: String,
    required: true,
    enum: ["contact", "campaign", "segment", "tag", "template", "organization"],
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true, default: Date },
});

export default mongoose.model("notification", notificationSchema);
