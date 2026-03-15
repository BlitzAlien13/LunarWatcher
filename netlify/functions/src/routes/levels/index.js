import express from "express";

const router = express.Router();

router.get("/guilds", (req, res) => {
  console.log(req.user);
  res.send("received!");
});

// GET: api.lunarwatcher.com/levels

router.get("/guild/:guildId", (req, res) => {
  const { guildId } = req.params;
  res.send(`Getting levels for guild id ${guildId}`);
});

router.post("/", (req, res) => {
  res.send("POST: levels route");
});

export default router;
