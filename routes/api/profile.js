var express = require("express");
var router = express.Router();

router.get("/", function(req, res) {
  res.send("profile route");
});

module.exports = router;
