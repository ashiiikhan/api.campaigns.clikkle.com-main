import mongoose from "mongoose";

const contact = new mongoose.Schema({
	email: { type: String, required: true },

	//////////////////// temporary FIX ////////////////////
	companyName: { type: String, default: "" },
	address: { type: String, default: "" },
	city: { type: String, default: "" },
	state: { type: String, default: "" },
	country: { type: String, default: "" },
	zipCode: { type: String, default: "" },
	faxNumber: { type: String, default: "" },
	sicCode: { type: String, default: "" },
	sicDescription: { type: String, default: "" },
	phone: { type: String, default: "" },
	webAddress: { type: String, default: "" },
	//////////////////// ============= ////////////////////

	subscribed: { type: Boolean, default: true },
	firstName: {
		type: String,
		// required: true, // temporary FIX //
		minlength: 3,
		maxlength: 255,
		trim: true,
	},
	lastName: {
		type: String,
		default: "",
		maxlength: 255,
		trim: true,
	},
	birthday: Date,
	userId: { type: mongoose.Types.ObjectId, required: true },
	tags: [mongoose.Types.ObjectId],
	source: {
		type: String,
		enum: ["manual", "form", "imported"],
		required: true,
	},
	rating: { type: Number, required: true, default: 0 },
	engagement: {
		type: String,
		required: true,
		default: "rarely",
		enum: ["rarely", "sometimes", "often"],
	},

	dateSubscribed: { type: Date },
	lastMailed: { type: Date },
	dateAdded: { type: Date, required: true, default: Date },
	lastChanged: { type: Date, required: true, default: Date },
});

contact.index({ userId: 1, email: 1 }, { unique: true });

export default mongoose.model("Contact", contact);
