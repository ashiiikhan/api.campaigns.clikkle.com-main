import express from "express";
import add from "../../routes/user/segments/add.js";
import deleteSegment from "../../routes/user/segments/delete.js";
import allSegments from "../../routes/user/segments/segments.js";
import view from "../../routes/user/segments/view.js";
const segments = express.Router();

segments.post("/", add);

segments.patch("/delete", deleteSegment);

segments.get("/", allSegments);
segments.get("/:id", view);

export default segments;
