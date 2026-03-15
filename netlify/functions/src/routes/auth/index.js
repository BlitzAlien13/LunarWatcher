import express from "express";
import User from "../../schemas/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// GET: api.lunarwatcher.com/levels
const router = express.Router();

const FALLBACK_DASHBOARD_URL = "https://lunar-watcher-dashboard.netlify.app";
const DISCORD_ENDPOINT = "https://discord.com/api/v10";
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const RAW_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;
const ENCODED_REDIRECT_URI = RAW_REDIRECT_URI
  ? encodeURIComponent(RAW_REDIRECT_URI)
  : null;

router.get("/signin", (req, res) => {
  console.log("Signin endpoint called");
  if (!CLIENT_ID || !RAW_REDIRECT_URI) {
    return res
      .status(500)
      .send("OAuth is misconfigured: missing client id or redirect uri");
  }
  res.redirect(
    `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${ENCODED_REDIRECT_URI}&scope=identify+guilds`,
  );
});

router.get("/callback", async (req, res) => {
  console.log(
    "Callback endpoint called with code:",
    req.query.code ? "present" : "missing",
  );
  try {
    if (!CLIENT_ID || !CLIENT_SECRET || !RAW_REDIRECT_URI) {
      return res
        .status(500)
        .send(
          "OAuth is misconfigured: missing client id/secret or redirect uri",
        );
    }

    const REDIRECT_URI = RAW_REDIRECT_URI;

    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        error: "A code query parameter must be present in the URL.",
      });
    }

    const oauthRes = await fetch(`${DISCORD_ENDPOINT}/oauth2/token`, {
      method: "POST",
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URI,
        code,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!oauthRes.ok) {
      console.log("OAuth error:", await oauthRes.text());
      return res.status(500).send("OAuth error");
    }

    const oauthResJson = await oauthRes.json();

    const userRes = await fetch(`${DISCORD_ENDPOINT}/users/@me`, {
      headers: {
        Authorization: `Bearer ${oauthResJson.access_token}`,
      },
    });

    if (!userRes.ok) {
      console.log("User fetch error:", await userRes.text());
      return res.status(500).send("User fetch error");
    }

    const userResJson = await userRes.json();

    let user = await User.findOne({ userId: userResJson.id });

    if (!user) {
      user = new User({
        userId: userResJson.id,
        username: userResJson.username,
        avatarHash: userResJson.avatar,
        accessToken: oauthResJson.access_token,
        refreshToken: oauthResJson.refresh_token,
      });
    } else {
      user.username = userResJson.username;
      user.avatarHash = userResJson.avatar;
      user.accessToken = oauthResJson.access_token;
      user.refreshToken = oauthResJson.refresh_token;
    }

    await user.save();

    const token = jwt.sign(
      {
        userId: userResJson.id,
        username: userResJson.username,
        avatarHash: userResJson.avatar,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    const dashboardUrl =
      process.env.DASHBOARD_URL ||
      req.get("origin") ||
      `${req.protocol}://${req.get("host")}` ||
      FALLBACK_DASHBOARD_URL;

    console.log("Setting cookie with token:", token ? "present" : "missing");
    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "None",
        path: "/",
        maxAge: 6.04e8,
      })
      .redirect(302, dashboardUrl);
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      return res.status(500).send("Internal server error");
    }
  }
});
export default router;
