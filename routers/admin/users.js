import express from "express";
import allUsers from "../../routes/admin/users/users.js";

const users = express.Router();

users.get("/", allUsers);

export default users;
