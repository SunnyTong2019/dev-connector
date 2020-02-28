const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

router.get("/", auth, function(req, res) {
  res.send("posts route");
});

module.exports = router;
