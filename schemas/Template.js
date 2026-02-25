import mongoose from 'mongoose';

const template = new mongoose.Schema(
	{
		userId: mongoose.Types.ObjectId,
		name: {
			type: String,
			required: true,
			minlength: 3,
			maxlength: 255,
			trim: true,
		},
		description: String,
		templateJson: mongoose.Schema.Types.Mixed,
		templateHtml: String,
		placeholders: [String],
		price: Number,
		cover: String,
	},
	{ timestamps: true }
);

template.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.model('template', template);
