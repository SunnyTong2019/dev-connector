const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const { check, validationResult } = require("express-validator");

// @route    GET api/profile/me
// @desc     Get current user's profile
// @access   Private
router.get("/me", auth, function(req, res) {
  Profile.findOne({ user: req.userID })
    .then(profile => {
      if (!profile)
        return res.status(400).json({ errors: [{ msg: "Profile Not Found" }] });
      res.json(profile);
    })
    .catch(err =>
      res.status(500).json({ errors: [{ msg: "Database Error" }] })
    );
});

// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
router.post(
  "/",
  [
    auth,

    [
      check("status")
        .not()
        .isEmpty()
        .withMessage("Status is required"),
      check("skills")
        .not()
        .isEmpty()
        .withMessage("Skills is required")
    ]
  ],
  function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    req.body.skills = req.body.skills.split(",").map(skill => skill.trim());

    Profile.findOneAndUpdate({ user: req.userID }, req.body, {
      upsert: true,
      new: true
    })
      .then(profile => {
        res.json(profile);
        console.log(profile.skills);
      })
      .catch(err =>
        res.status(500).json({ errors: [{ msg: "Database Error" }] })
      );
  }
);

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private

// @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private

// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private

// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private

// @route    DELETE api/profile/education/:edu_id
// @desc     Delete education from profile
// @access   Private

// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public
module.exports = router;
