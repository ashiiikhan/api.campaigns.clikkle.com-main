import express from "express";
import getDashboardData from "../../routes/user/dashboard/dashboard.js";

const dashboard = express.Router();

dashboard.get("/", getDashboardData);

export default dashboard;
