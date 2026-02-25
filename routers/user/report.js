import express from "express";
import view from "../../routes/user/reports/view.js";

const report = express.Router();

report.get("/:id", view);

export default report;
