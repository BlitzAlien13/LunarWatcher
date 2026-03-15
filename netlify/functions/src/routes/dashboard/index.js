import express from "express";
import meRouter from "./@me/index.js";

const router = express.Router();

router.use("/@me", meRouter);

export default router;
