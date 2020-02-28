const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

router.get("/", function(req, res) {
  res.send("auth route");
});

// @router  post
// @desc    register user
// @status  public
router.post(
  "/register",
  [
    check("name")
      .not()
      .isEmpty(),
    check("email").isEmail(),
    check("password").isLength({ min: 6 })
  ],
  function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    res.send("auth route");
  }
);

module.exports = router;
