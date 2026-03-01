import express from "express";
import axios from "axios";

const router = new express.Router();

const ACCOUNTS_API_URL =
  process.env.ACCOUNTS_API_URL || "https://api.admin.clikkle.com";

async function forwardAuthRequest(req, res, next, path) {
  try {
    const url = `${ACCOUNTS_API_URL}${path}`;
    const upstream = await axios.post(url, req.body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res.status(upstream.status).json(upstream.data);
  } catch (err) {
    if (err.response) {
      return res
        .status(err.response.status)
        .json(err.response.data ?? { message: "Upstream error" });
    }
    return next(err);
  }
}

router.post("/auth/exist", (req, res, next) =>
  forwardAuthRequest(req, res, next, "/auth/exist")
);

router.post("/auth/login", (req, res, next) =>
  forwardAuthRequest(req, res, next, "/auth/login")
);

router.post("/auth/get_user_profile", (req, res, next) =>
  forwardAuthRequest(req, res, next, "/auth/get_user_profile")
);

router.post("/auth/socialLogin", (req, res, next) =>
  forwardAuthRequest(req, res, next, "/auth/socialLogin")
);

export default router;

