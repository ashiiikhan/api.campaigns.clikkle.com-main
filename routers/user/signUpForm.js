import express from "express";
import signUpForms from "../../routes/user/signupforms/signupforms.js";
import addSignUpForm from "../../routes/user/signupforms/add.js";
import deleteForm from "../../routes/user/signupforms/delete.js";
import view from "../../routes/user/signupforms/view.js";

const signUpForm = express.Router();

signUpForm.get("/", signUpForms);
signUpForm.get("/:id", view);

signUpForm.post("/", addSignUpForm);

signUpForm.patch("/delete", deleteForm);

export default signUpForm;
