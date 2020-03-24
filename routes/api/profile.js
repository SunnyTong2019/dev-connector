const express = require("express");
const router = express.Router();
const config = require("config");
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const request = require("request");

// @route    GET api/profile/me
// @desc     Get current user profile
// @access   Private
router.get("/me", auth, function(req, res) {
  Profile.findOne({ user: req.userID })
    .populate("user")
    .then(profile => {
      if (!profile)
        return res.status(400).json({ errors: [{ msg: "Profile not found" }] });
      res.json(profile);
    })
    .catch(err =>
      res.status(500).json({ errors: [{ msg: "Database error" }] })
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

    let social = {};
    if (req.body.youtube) social.youtube = req.body.youtube;
    if (req.body.twitter) social.twitter = req.body.twitter;
    if (req.body.facebook) social.facebook = req.body.facebook;
    if (req.body.linkedin) social.linkedin = req.body.linkedin;
    if (req.body.instagram) social.instagram = req.body.instagram;

    req.body.social = social;

    Profile.findOneAndUpdate({ user: req.userID }, req.body, {
      upsert: true,
      new: true
    })
      .then(profile => {
        res.json(profile);
      })
      .catch(err =>
        res.status(500).json({ errors: [{ msg: "Database error" }] })
      );
  }
);

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get("/", function(req, res) {
  Profile.find()
    .then(profiles => {
      if (profiles.length === 0)
        return res.status(400).json({ errors: [{ msg: "No profiles" }] });
      res.json(profiles);
    })
    .catch(err =>
      res.status(500).json({ errors: [{ msg: "Database error" }] })
    );
});

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get("/user/:user_id", function(req, res) {
  Profile.findOne({ user: req.params.user_id })
    .then(profile => {
      if (!profile)
        return res.status(400).json({ errors: [{ msg: "Profile not found" }] });
      res.json(profile);
    })
    .catch(err =>
      res.status(500).json({ errors: [{ msg: "Database error" }] })
    );
});

// @route    DELETE api/profile
// @desc     Delete current user, its profile, and its posts
// @access   Private
router.delete("/", auth, function(req, res) {
  // @to-do delete user's posts

  Profile.findOneAndDelete({ user: req.userID })
    .then(profile => User.findOneAndDelete({ _id: req.userID }))
    .then(user => res.send("User removed"))
    .catch(err =>
      res.status(500).json({ errors: [{ msg: "Database error" }] })
    );
});

// @route    PUT api/profile/experience
// @desc     Add experience
// @access   Private
router.put(
  "/experience",
  [
    auth,
    [
      check("title")
        .not()
        .isEmpty()
        .withMessage("Title is required"),
      check("company")
        .not()
        .isEmpty()
        .withMessage("Company is required"),
      check("from")
        .not()
        .isEmpty()
        .withMessage("From date is required")
    ]
  ],
  function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    Profile.findOneAndUpdate(
      { user: req.userID },
      { $push: { experience: req.body } },
      { new: true }
    )
      .then(profile => {
        if (!profile)
          return res
            .status(400)
            .json({ errors: [{ msg: "Profile not found" }] });
        res.json(profile);
      })
      .catch(err =>
        res.status(500).json({ errors: [{ msg: "Database error" }] })
      );
  }
);

// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private
router.delete("/experience/:exp_id", auth, function(req, res) {
  Profile.findOne({ user: req.userID })
    .then(profile => {
      let experience = profile.experience;
      experience = experience.filter(exp => exp._id != req.params.exp_id);
      return Profile.findOneAndUpdate(
        { user: req.userID },
        { $set: { experience: experience } },
        { new: true }
      );
    })
    .then(profile => res.json(profile))
    .catch(err =>
      res.status(500).json({ errors: [{ msg: "Database error" }] })
    );
});

// @route    PUT api/profile/education
// @desc     Add education
// @access   Private
router.put(
  "/education",
  [
    auth,
    [
      check("school")
        .not()
        .isEmpty()
        .withMessage("School is required"),
      check("degree")
        .not()
        .isEmpty()
        .withMessage("Degree is required"),
      check("fieldofstudy")
        .not()
        .isEmpty()
        .withMessage("Field of study is required"),
      check("from")
        .not()
        .isEmpty()
        .withMessage("From date is required")
    ]
  ],
  function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    Profile.findOneAndUpdate(
      { user: req.userID },
      { $push: { education: req.body } },
      { new: true }
    )
      .then(profile => {
        if (!profile)
          return res
            .status(400)
            .json({ errors: [{ msg: "Profile not found" }] });
        res.json(profile);
      })
      .catch(err =>
        res.status(500).json({ errors: [{ msg: "Database error" }] })
      );
  }
);

// @route    DELETE api/profile/education/:edu_id
// @desc     Delete education from profile
// @access   Private
router.delete("/education/:edu_id", auth, function(req, res) {
  Profile.findOne({ user: req.userID })
    .then(profile => {
      let education = profile.education;
      education = education.filter(edu => edu._id != req.params.edu_id);
      return Profile.findOneAndUpdate(
        { user: req.userID },
        { $set: { education: education } },
        { new: true }
      );
    })
    .then(profile => res.json(profile))
    .catch(err =>
      res.status(500).json({ errors: [{ msg: "Database error" }] })
    );
});

// @route    GET api/profile/github/:username
// @desc     Get repos from Github user
// @access   Public
router.get("/github/:username", function(req, res) {
  const options = {
    uri: `https://api.github.com/users/${
      req.params.username
    }/repos?per_page=5&sort=created:asc&client_id=${config.get(
      "githubClientID"
    )}&client_secret=${config.get("githubClientSecret")}`,
    method: "GET",
    headers: {
      "user-agent": "node.js"
    }
  };

  request(options, (error, response, body) => {
    if (error)
      return res.status(500).json({ errors: [{ msg: "Server error" }] });
    if (response.statusCode !== 200) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Github profile not found" }] });
    }
    res.json(JSON.parse(body));
  });
});

module.exports = router;
