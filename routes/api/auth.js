const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const config = require("config");
const mongoURI = config.get("mongoURI");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const jwtSecret = config.get("jwtSecret");

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

// @router  POST /api/auth/register
// @desc    Register user
// @access  Public
router.post(
  "/register",
  [
    check("name")
      .not()
      .isEmpty()
      .withMessage("name is required"),
    check("email")
      .isEmail()
      .withMessage("Please provide valid email address"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("password must be at least 6 chars long")
  ],
  function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let { email, password } = req.body;

    // check if the email exists, it not, hash password and save the user to DB
    User.findOne({ email: email }, (err, user) => {
      if (err) {
        return res.status(500).json({ errors: [{ msg: "Database Error" }] });
      }

      if (user) {
        return res
          .status(422)
          .json({ errors: [{ msg: "Email already exists" }] });
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(password, salt);
      req.body.password = hash;

      User.create(req.body).then(newUser => {
        // use JWT to return a token
        let token = jwt.sign({ userID: newUser.id }, jwtSecret);
        res.json(token);
      });
    });
  }
);

module.exports = router;
