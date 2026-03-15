const express = require("express");

const router = express.Router();

// GET: api.lunarwatcher.com/levels

router.get("/", (req, res) => {
  res.send("welcomes route working!");
});

module.exports = router;
