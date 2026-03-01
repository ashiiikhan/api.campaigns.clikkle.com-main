import "./config/config.js";
import "./workers/emailWorker.js"; // Start Email Worker
import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import multer from "multer";
import morgan from "morgan";
import fs from "fs";
import http from "http";
import https from "https";

// -------------- Routers -------------- //
import userRouter from "./routers/user.js";
import adminRouter from "./routers/admin.js";
import unauthorizedRouter from "./routers/unauthorized.js";
import emailRouter from "./routers/email.js";

// -------------- Middlewares -------------- //
import authenticate from "./middleware/authenticate.js";

// -------------- Webhooks -------------- //
import webhook from "./routers/webhook.js";

// -------------- Error Handlers -------------- //
import errorHandler from "./middleware/errorHandler.js";
import booleanBodyParser from "./middleware/booleanBodyParser.js";

const app = express();

// Setup multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),
});

// Middlewares
app.use(morgan("dev"));
app.use(bodyParser.json({ type: ["application/json", "text/plain"] }));
app.use(booleanBodyParser);
app.use(cookieParser());
app.use(
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "csv_file", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ])
);

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:9000",
  "http://localhost:9001",
  "https://campaigns.clikkle.com",
  "https://campaigns-staging.vercel.app",
  process.env.DASHBOARD_URL,
  process.env.CORS_ORIGIN,
].filter(Boolean);

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Webhooks
app.use("/webhooks", webhook);

// Static files
app.use("/static", express.static("uploads"));
// app.use("/.well-known", express.static("./.well-known"));

// Unauthorized Routes
app.use(unauthorizedRouter);

// Protected Routes (with Authentication Middleware)
app.use("/user", authenticate, userRouter);
app.use("/admin", authenticate, adminRouter);
app.use("/email", emailRouter); // Test endpoint, maybe protect later

// Basic Home Route
app.get("/", (req, res) => {
  res.status(200).send("Server is running successfully 🚀");
});

// Error Handler (last middleware)
app.use(errorHandler);

// ----------- Start Server ----------- //
const port = process.env.PORT || 9000;

console.log("Starting server...");
console.log("Email Router imported:", !!emailRouter);
console.log("Unauthorized Router imported:", !!unauthorizedRouter);

// SSL cert paths
const privateKeyPath = "../ssl/keys/a2b5f_4c331_6fb1491236bab92b40df763e83c2b2c8.key";
const certificatePath = "../ssl/certs/_wildcard__campaigns_clikkle_com_a2b5f_4c331_1776578526_c2229c019c543cb0efe49f8ddc1a9336.crt";

let server;

try {
  const privateKey = fs.readFileSync(privateKeyPath, "utf8");
  const certificate = fs.readFileSync(certificatePath, "utf8");
  const credentials = { key: privateKey, cert: certificate };

  server = https.createServer(credentials, app);
  server.listen(port, () => {
    console.log(`✅ HTTPS Server running on port ${port}`);
  });
} catch (err) {
  console.warn("⚠️ SSL certificates not found, falling back to HTTP:", err.message);
  server = http.createServer(app);
  server.listen(port, () => {
    console.log(`🌐 HTTP Server running on port ${port}`);
  });
}

export default app;
