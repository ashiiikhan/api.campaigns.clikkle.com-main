import express from "express";
import contactsDashboard from "../../routes/user/contacts/dashboard.js";
import contacts from "../../routes/user/contacts/contacts.js";
import addContact from "../../routes/user/contacts/add.js";
import tagContacts from "../../routes/user/contacts/tag.js";
import deleteContacts from "../../routes/user/contacts/delete.js";
import subscribeContacts from "../../routes/user/contacts/subscibe.js";
import unsubscribeContacts from "../../routes/user/contacts/unsubscribe.js";
import view from "../../routes/user/contacts/view.js";
import update from "../../routes/user/contacts/update.js";
import importCSV from "../../routes/user/contacts/importCSV.js";
import removeTag from "../../routes/user/contacts/removeTag.js";

const contact = express.Router();

contact.get("/", contacts);
contact.get("/dashboard", contactsDashboard);
contact.get("/:id", view);

contact.post("/", addContact);
contact.post("/delete", deleteContacts);
contact.post("/import-csv", importCSV);

contact.patch("/tag", tagContacts);
contact.patch("/subscribe", subscribeContacts);
contact.patch("/unsubscribe", unsubscribeContacts);
contact.patch("/remove-tag", removeTag);
contact.patch("/:id", update);

export default contact;
