require("dotenv").config();
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");
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

    req.body.user = req.userID;

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
    .populate("user", "name avatar")
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
    .populate("user", "name avatar")
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
  // delete user's posts first, then delete user's comments made on other people's posts, then delete its profile, then user itself
  Post.deleteMany({ user: req.userID })
    .then(results => console.log(results))
    .catch(err =>
      res.status(500).json({ errors: [{ msg: "Database error" }] })
    );

  Post.find()
    .then(posts => {
      if (posts.length > 0) {
        posts.forEach(post => {
          let targetComments = post.comments.filter(
            comment => comment.user == req.userID
          );

          if (targetComments.length > 0) {
            // if comments exist
            let comments = post.comments;
            comments = comments.filter(comment => comment.user != req.userID);

            Post.findOneAndUpdate(
              { _id: post._id },
              { $set: { comments: comments } },
              { new: true }
            )
              .then(result => console.log(result))
              .catch(err =>
                res.status(500).json({ errors: [{ msg: "Database error" }] })
              );
          }
        });
      }
    })
    .catch(err => res.status(500).json({ errors: [{ msg: "Database error" }] }))
    .finally(() => {
      Profile.findOneAndDelete({ user: req.userID })
        .then(profile => User.findOneAndDelete({ _id: req.userID }))
        .then(user => res.json("User removed"))
        .catch(err =>
          res.status(500).json({ errors: [{ msg: "Database error" }] })
        );
    });
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
    uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${process.env.githubClientID}&client_secret=${process.env.githubClientSecret}`,
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
