import express from "express";
import getNotifications from "../../routes/user/notifications/notifications.js";

const notification = express.Router();

notification.get("/", getNotifications);

export default notification;
