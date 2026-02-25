import mongoose from "mongoose";

const signUpForm = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        maxlength: 15,
        minlength: 3,
        trim: true,
    },
    dateCreated: { type: Date, required: true },
    content: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true },
});

signUpForm.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.model("SignUpForm", signUpForm);
