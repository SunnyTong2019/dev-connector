const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const auth = require("../../middleware/auth");

// @route    GET api/user
// @desc     Get user by token
// @access   Private
router.get("/", auth, function(req, res) {
  User.findOne({ _id: req.userID }, "-password", (err, user) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ errors: [{ msg: "Database Error" }] });
    }

    res.json(user);
  });
});

module.exports = router;
