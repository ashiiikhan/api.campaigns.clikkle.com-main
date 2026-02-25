import mongoose from "mongoose";
import DataSource from "../classes/DataSource.js";
import Contact from "./Contact.js";

const tag = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 15,
		trim: true,
	},
	createdAt: { type: Date, required: true },
	contacts: { type: Number, required: true, default: 0 },
	userId: { type: mongoose.Types.ObjectId, required: true },
});

tag.index({ userId: 1, name: 1 }, { unique: true });

tag.methods.getContacts = async function (query = {}) {
	const dataSource = new DataSource(Contact, query);
	const contacts = await dataSource.aggregate([
		{
			$match: {
				userId: this.userId,
				tags: {
					$all: [this._id],
				},
			},
		},
		{
			$lookup: {
				from: "tags",
				localField: "tags",
				foreignField: "_id",
				as: "tags",
			},
		},
	]);

	return { contacts, pageData: dataSource.pageData };
};

export default mongoose.model("Tag", tag);
