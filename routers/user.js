import express from "express";
import contact from "./user/contact.js";
import tag from "./user/tag.js";
import signUpForm from "./user/signUpForm.js";
import profile from "./user/profile.js";
import segments from "./user/segments.js";
import campaign from "./user/campaign.js";
import template from "./user/template.js";
import dashboard from "./user/dashboard.js";
import report from "./user/report.js";
import getProfile from "../routes/user/profile/profile.js";
import notification from "./user/notifications.js";
import organization from "./user/organization.js";
import automation from "../routes/user/automations.js";

const userRouter = new express.Router();

userRouter.use((req, res, next) => {
	if (req.user.role === "user") return next();
	res.status(401).json({ success: 0, message: "role is not matched", });
});

userRouter.get("/", getProfile);
userRouter.use("/contacts", contact);
userRouter.use("/tags", tag);
userRouter.use("/signupforms", signUpForm);
userRouter.use("/profile", profile);
userRouter.use("/segments", segments);
userRouter.use("/campaigns", campaign);
userRouter.use("/templates", template);
userRouter.use("/dashboard", dashboard);
userRouter.use("/reports", report);
userRouter.use("/notifications", notification);
userRouter.use("/organizations", organization);
userRouter.use("/automations", automation);

export default userRouter;
