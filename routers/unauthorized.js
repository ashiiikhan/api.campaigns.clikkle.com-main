import express from "express";
import createAccount from "../routes/unauthorized/createAccount.js";
import authorize from "../routes/unauthorized/authorize.js";
import get_user_profile from "../routes/unauthorized/get_user_profile.js";
import userExist from "../routes/unauthorized/exist.js";
import getAllPlans from "../routes/unauthorized/plan.js";
import verifyUser from "../routes/unauthorized/verifyUser.js";
import resetPassword from "../routes/unauthorized/resetPassword.js";
import createPassword from "../routes/unauthorized/createPassword.js";
import unsubscribe from "../routes/unauthorized/unsubscribe.js";

console.log("Unsubscribe controller imported:", !!unsubscribe);

const testc = (req,res,next) => {
    console.log("testc",req.body);
    res.json({
        success: 1,
        message: "testc"
    });
}
const unauthorizedRouter = new express.Router();

unauthorizedRouter.post("/login", authorize);
unauthorizedRouter.post("/get_user_profile" , get_user_profile);
unauthorizedRouter.post("/create-account", createAccount);
unauthorizedRouter.post("/exist", userExist);
unauthorizedRouter.get("/plans", getAllPlans);
unauthorizedRouter.get("/verify/:token", verifyUser);
unauthorizedRouter.post("/reset-password", resetPassword);
unauthorizedRouter.post("/create-password", createPassword);
unauthorizedRouter.get("/u/:token", unsubscribe);

export default unauthorizedRouter;
