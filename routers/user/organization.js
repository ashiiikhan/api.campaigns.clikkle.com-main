import express from "express";

import addOrganization from "../../routes/user/organizations/add.js";
import organizations from "../../routes/user/organizations/organizations.js";
import deleteOrganization from "../../routes/user/organizations/delete.js";
import viewOrganization from "../../routes/user/organizations/view.js";
import updateOrganization from "../../routes/user/organizations/update.js";

const organization = express.Router();

organization.post("/", addOrganization);

organization.delete("/delete/:id", deleteOrganization);

organization.post("/:id", updateOrganization);

organization.get("/", organizations);
organization.get("/:id", viewOrganization);

export default organization;