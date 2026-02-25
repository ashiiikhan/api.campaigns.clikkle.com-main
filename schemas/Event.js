import mongoose from "mongoose";

const event = new mongoose.Schema({
    name: { type: String, required: true },
    campaignId: { type: mongoose.Types.ObjectId, required: true },
    contactId: { type: mongoose.Types.ObjectId, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true },
    date: { type: Date, default: Date },
});

export default mongoose.model("Event", event);
