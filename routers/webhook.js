import express from "express";
import mails from "../routes/webhooks/mails.js";

const webhook = express.Router();

webhook.post("/", mails);

export default webhook;
