import express from "express";
import allCampaign from "../../routes/user/campaigns/campaigns.js";
import create from "../../routes/user/campaigns/create.js";
import update from "../../routes/user/campaigns/update.js";
import send from "../../routes/user/campaigns/send.js";
import viewCampaign from "../../routes/user/campaigns/view.js";
import deleteCampaign from "../../routes/user/campaigns/delete.js";
import selectTemplate from "../../routes/user/campaigns/selectTemplate.js";
import getCampaignDetails from "../../routes/user/campaigns/details.js";

const campaign = express.Router();

campaign.post("/", create);

campaign.get("/", allCampaign);
campaign.get("/:id", viewCampaign);

campaign.patch("/:id", update);
campaign.patch("/send/:id", send);
campaign.patch("/select-template/:id", selectTemplate);

campaign.delete("/:id", deleteCampaign);
campaign.get("/details/:id", getCampaignDetails)

export default campaign;
