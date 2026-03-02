import express from "express";
import axios from "axios";

const router = new express.Router();

// Central Clikkle accounts API (same as worksuite.clikkle.com)
const ACCOUNTS_API_URL =
  process.env.ACCOUNTS_API_URL || "https://accounts.clikkle.com:5000/api";

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

// Email step (check if email exists) – same as official worksuite.clikkle.com
router.post("/auth/login_email", (req, res, next) =>
  forwardAuthRequest(req, res, next, "/auth/login_email")
);

// Password step – same as official worksuite.clikkle.com
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

