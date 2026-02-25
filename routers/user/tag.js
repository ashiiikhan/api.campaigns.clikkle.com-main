import express from "express";

import addTag from "../../routes/user/tags/add.js";
import tags from "../../routes/user/tags/tags.js";
import deleteTag from "../../routes/user/tags/delete.js";
import viewTag from "../../routes/user/tags/view.js";
import updateTag from "../../routes/user/tags/update.js";

const tag = express.Router();

tag.post("/", addTag);

tag.patch("/delete", deleteTag);
tag.patch("/:id", updateTag);

tag.get("/", tags);
tag.get("/:id", viewTag);

export default tag;
