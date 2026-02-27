import express from "express";
import testEmail from "../routes/email/test.js";

const emailRouter = express.Router();

emailRouter.post("/test", testEmail);

export default emailRouter;
