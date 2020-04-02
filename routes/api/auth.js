require("dotenv").config();
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");

// @router  POST /api/auth/register
// @desc    Register user
// @access  Public
router.post(
  "/register",
  [
    check("name")
      .not()
      .isEmpty()
      .withMessage("Name is required"),
    check("email")
      .isEmail()
      .withMessage("Please provide valid email address"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 chars long")
  ],
  function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { email, password } = req.body;

    // check if the email exists, it not, hash password and save the user to DB
    User.findOne({ email: email }, (err, user) => {
      if (err) {
        return res.status(500).json({ errors: [{ msg: "Database error" }] });
      }

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Email already in use" }] });
      }

      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });

      req.body.avatar = avatar;

      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(password, salt);
      req.body.password = hash;

      User.create(req.body)
        .then(newUser => {
          // use JWT to return a token
          let token = jwt.sign({ userID: newUser.id }, process.env.jwtSecret, {
            expiresIn: "2h"
          });
          res.json(token);
        })
        .catch(err =>
          res.status(500).json({ errors: [{ msg: "Database error" }] })
        );
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
      .withMessage("Password is required")
  ],
  function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { email, password } = req.body;

    // check if the email exists
    // if yes, check if password matches
    User.findOne({ email: email }, (err, user) => {
      if (err) {
        return res.status(500).json({ errors: [{ msg: "Database error" }] });
      }

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      const hash = user.password;

      bcrypt.compare(password, hash).then(function(result) {
        if (result) {
          // if password matches, return a token
          let token = jwt.sign({ userID: user.id }, process.env.jwtSecret, {
            expiresIn: "2h"
          });
          res.json(token);
        } else {
          return res
            .status(400)
            .json({ errors: [{ msg: "Invalid credentials" }] });
        }
      });
    });
  }
);

module.exports = router;
