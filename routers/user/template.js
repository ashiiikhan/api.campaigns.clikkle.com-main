import express from "express";
import create from "../../routes/user/templates/create.js";
import deleteTemplates from "../../routes/user/templates/delete.js";
import purchaseTemplate from "../../routes/user/templates/purchase.js";
import savedTemplates from "../../routes/user/templates/savedTemplates.js";
import templatesForSale from "../../routes/user/templates/templatesForSale.js";
import update from "../../routes/user/templates/update.js";
import view from "../../routes/user/templates/view.js";

const template = express.Router();

template.get("/", savedTemplates);
template.get("/for-sale", templatesForSale);
template.get("/:id", view);

template.post("/", create);
template.post("/purchase", purchaseTemplate);
template.post("/delete", deleteTemplates);

template.patch("/:id", update);

export default template;
