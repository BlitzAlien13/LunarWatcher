import express, { Router } from "express";
import serverless from "serverless-http";
import mongoose from "mongoose";

import authRouter from "./src/routes/auth/index.js";
import dashboardRouter from "./src/routes/dashboard/index.js";
import levelsRouter from "./src/routes/levels/index.js";

const api = express();
const router = Router();
const mongoUri = process.env.MONGODB_URI;
const mongoDbName = process.env.MONGODB_DB;
let mongoReadyPromise;

async function ensureMongoConnected() {
  if (!mongoReadyPromise) {
    mongoReadyPromise = mongoose.connect(mongoUri, {
      dbName: mongoDbName || undefined,
    });
  }
  return mongoReadyPromise;
}

// quick path logger to diagnose routing in Netlify/Express
api.use((req, _res, next) => {
  console.log("[api]", { originalUrl: req.originalUrl, url: req.url, baseUrl: req.baseUrl, path: req.path });
  next();
});

// Make sure we have a Mongo connection before handling routes
api.use(async (req, res, next) => {
  try {
    if (!mongoUri) {
      throw new Error("MONGODB_URI env var is missing");
    }
    await ensureMongoConnected();
    next();
  } catch (err) {
    console.error("Mongo connection error", err);
    res.status(500).send("Database connection error");
  }
});

router.get("/hello", (req, res) => res.send("Hello World!"));

router.use("/auth", authRouter);
router.use("/dashboard", dashboardRouter);
router.use("/levels", levelsRouter);

// Netlify rewrites /api/* -> /.netlify/functions/api/:splat.
// Depending on the runtime, the path seen by Express can include the
// "/.netlify/functions/api" prefix *or* already be stripped. Mount both.
api.use("/.netlify/functions/api", router);
api.use("/api", router);
api.use("/", router);

export const handler = serverless(api);
