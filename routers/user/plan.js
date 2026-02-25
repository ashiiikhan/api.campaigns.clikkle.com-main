import express from "express";
import getAllPlans from "../../routes/user/plan.js";
import update from "../../routes/user/plan/update.js";

const plan = express.Router();

plan.get("/", getAllPlans);
plan.post("/update", update);

export default plan;
