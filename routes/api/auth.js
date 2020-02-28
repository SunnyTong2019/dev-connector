const express = require("express");
const router = express.Router();
const config = require("config");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const jwtSecret = config.get("jwtSecret");

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

// @router  POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .withMessage("Please provide valid email address"),
    check("password")
      .not()
      .isEmpty()
      .withMessage("password is required")
  ],
  function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let { email, password } = req.body;

    // check if the email exists
    // if yes, check if password matches
    User.findOne({ email: email }, (err, user) => {
      if (err) {
        return res.status(500).json({ errors: [{ msg: "Database Error" }] });
      }

      if (!user) {
        return res
          .status(422)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const hash = user.password;
      bcrypt.compare(password, hash).then(function(result) {
        if (result) {
          // if password matches, return a token
          let token = jwt.sign({ userID: user.id }, jwtSecret);
          res.json(token);
        } else {
          return res
            .status(422)
            .json({ errors: [{ msg: "Invalid Credentials" }] });
        }
      });
    });
  }
);

module.exports = router;
