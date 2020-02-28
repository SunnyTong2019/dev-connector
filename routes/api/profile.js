const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

router.get("/", auth, function(req, res) {
  res.send("profile route");
});

module.exports = router;
