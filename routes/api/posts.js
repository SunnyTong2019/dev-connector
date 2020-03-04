const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Post = require("../../models/Post");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");

// @route    POST api/posts
// @desc     Create a post
// @access   Private
router.post(
  "/",
  [
    auth,
    [
      check("text")
        .not()
        .isEmpty()
        .withMessage("Text is required")
    ]
  ],
  function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let newPost = {
      text: req.body.text,
      user: req.userID
    };

    Post.create(newPost)
      .then(post => {
        res.json(post);
      })
      .catch(err =>
        res.status(500).json({ errors: [{ msg: "Database Error" }] })
      );
  }
);

// @route    GET api/posts
// @desc     Get all posts
// @access   Private

// @route    GET api/posts/:postid
// @desc     Get post by Post ID
// @access   Private

// @route    DELETE api/posts/:postid
// @desc     Delete a post
// @access   Private

// @route    PUT api/posts/like/:postid
// @desc     Like a post
// @access   Private

// @route    PUT api/posts/unlike/:postid
// @desc     Unlike a post
// @access   Private

// @route    PUT api/posts/comments/:postid
// @desc     Add comment to a post
// @access   Private

// @route    PUT api/posts/comments/:postid/:commentid
// @desc     Delete comment
// @access   Private

module.exports = router;
