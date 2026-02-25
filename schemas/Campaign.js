import mongoose from 'mongoose';

const campaign = new mongoose.Schema({
	userId: { type: mongoose.Types.ObjectId, required: true },
	name: {
		type: String,
		required: true,
		default: () => `cam_${Date.now()}`,
		minlength: 3,
		maxlength: 30,
		trim: true,
	},
	createdAt: { type: Date, default: Date },
	to: {
		type: { type: String, enum: ['tag', 'segment'] },
		id: { type: mongoose.Types.ObjectId },
		name: { type: String },
	},
	from: {
		name: { type: String },
		email: { type: String },
	},
	subject: { type: String },
	previewText: { type: String },
	template: {
		type: mongoose.Types.ObjectId,
		ref: 'template',
	},
	templateMappings: {
		type: mongoose.Schema.Types.Mixed,
	},
	status: {
		type: String,
		required: true,
		default: 'draft',
		enum: ['draft', 'ongoing', 'completed'],
	},
	contacts: { type: Number },
});

campaign.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.model('campaign', campaign);
