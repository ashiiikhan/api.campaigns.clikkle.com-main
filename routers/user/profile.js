import express from "express";
import changePassword from "../../routes/user/profile/changePassword.js";
import picture from "../../routes/user/profile/picture.js";
import getProfile from "../../routes/user/profile/profile.js";
import updateProfile from "../../routes/user/profile/update.js";

const profile = express.Router();

profile.get("/", getProfile);

profile.patch("/", updateProfile);
profile.patch("/password", changePassword);
profile.patch("/picture", picture);

export default profile;
