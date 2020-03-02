const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const auth = require("../../middleware/auth");

// @route    GET api/user
// @desc     Get user by token
// @access   Private
router.get("/", auth, function(req, res) {
  User.findOne({ _id: req.userID })
    .select("-password")
    .then(user => res.json(user))
    .catch(err =>
      res.status(500).json({ errors: [{ msg: "Database Error" }] })
    );
});

module.exports = router;
