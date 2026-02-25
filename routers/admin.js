import express from "express";
import users from "./admin/users.js";
// import plan from './admin/plan.js';

const adminRouter = new express.Router();

adminRouter.use((req, res, next) => {
    if (req.user.role === "admin") return next();
    res.status(401);
    res.json({
        success: 0,
        message: "role is not matched",
    });
});

// Admin Routes
adminRouter.use("/users", users);
// adminRouter.use("/plans", plan);

export default adminRouter;
