import mongoose from "mongoose";
import Contact from "./Contact.js";
import DataSource from "../classes/DataSource.js";

const segment = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 15,
		trim: true,
	},
	filters: { type: Object, required: true },
	userId: { type: mongoose.Types.ObjectId, required: true },
	dateCreated: { type: Date, required: true },
	type: { type: String, required: true, default: "AND", enum: ["AND", "OR"] },
});

segment.index({ userId: 1, name: 1 }, { unique: true });

segment.methods.getQuery = function () {
	if (this.type === "OR") {
		return { $or: this.filters, userId: this.userId };
	}

	let filters = {};
	this.filters.forEach((filter) => {
		for (const cond in filter) {
			if (filters.hasOwnProperty(cond)) {
				filters[cond] = { ...filters[cond], ...filter[cond] };
			} else {
				filters[cond] = filter[cond];
			}
		}
	});

	return { ...filters, userId: this.userId };
};

segment.methods.getContacts = async function (query = {}) {
	const dataSource = new DataSource(Contact, query);

	console.log("query", this.getQuery())

	const contacts = await dataSource.aggregate([
		{
			$match: this.getQuery(),
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

	return {
		contacts,
		pageData: dataSource.pageData,
	};
};

export default mongoose.model("segment", segment);
