import mongoose from "mongoose";
import DataSource from "../classes/DataSource.js";
import Contact from "./Contact.js";

const organization = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 25,
      trim: true,
    },
    Email: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
      trim: true,
    },
    Size: {
      type: Number,
      required: true,
      minlength: 1,
      maxlength: 50,
      trim: true,
    },
    Website: {
      type: String,
      required: true,
      minlength: 2,
      trim: true,
    },
    Address: {
      type: String,
      required: true,
      minlength: 2,
      trim: true,
    },
    Country: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 15,
      trim: true,
    },
    ZipCode: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 15,
      trim: true,
    },
    City: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 15,
      trim: true,
    },
    CompanyIndustry: {
      type: String,
      minlength: 2,
      maxlength: 15,
      trim: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    createdAt: { type: Date, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true },
    ownerId: { type: String, required: true }, 
  },
  { timestamps: true }
);

organization.pre("save", function (next) {
  if (this.userId) {
    this.ownerId = this.userId.toString();
  }
  next();
});

organization.index({ userId: 1, name: 1 }, { unique: true });

organization.methods.getContacts = async function (query = {}) {
  const dataSource = new DataSource(Contact, query);
  const contacts = await dataSource.aggregate([
    {
      $match: {
        userId: this.userId,
        organizations: {
          $all: [this._id],
        },
      },
    },
    {
      $lookup: {
        from: "organizations",
        localField: "organizations",
        foreignField: "_id",
        as: "organizations",
      },
    },
  ]);

  return { contacts, pageData: dataSource.pageData };
};

export default mongoose.model("Organization", organization);
