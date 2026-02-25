import mongoose from "mongoose";

const schema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user", required: true },
    firstName: { type: String, required: true },
    lastName: String,
    picture: String,
    phone: { type: String },
    address: { type: String },
    prospects: String,
    employees: String,
    industry: String,
    isVerified: { type: Boolean, default: false, required: true },
    token: {
        type: String,
    },
});

export default mongoose.model("User", schema);
