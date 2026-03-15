import express from "express";
import setReqUser from "./set-req-user.js";

const router = express.Router();

router.use(setReqUser);

export default router;
