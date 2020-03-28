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
      .then(post =>
        // for the returned newly created post, populate user field because user details like name, avatar are needed in the front end to display the post
        Post.populate(post, { path: "user", select: "name avatar" }, function(
          error,
          result
        ) {
          if (error)
            return res
              .status(500)
              .json({ errors: [{ msg: "Database error" }] });
          res.json(result);
        })
      )
      .catch(err =>
        res.status(500).json({ errors: [{ msg: "Database error" }] })
      );
  }
);

// @route    GET api/posts/me
// @desc     Get all posts from current user
// @access   Private
// router.get("/me", auth, function(req, res) {
//   Post.find({ user: req.userID })
//     .populate("user", "name avatar")
//     .then(posts => {
//       if (posts.length === 0)
//         return res.status(400).json({ errors: [{ msg: "No posts" }] });
//       res.json(posts);
//     })
//     .catch(err =>
//       res.status(500).json({ errors: [{ msg: "Database error" }] })
//     );
// });

// @route    GET api/posts
// @desc     Get all posts
// @access   Private
router.get("/", auth, function(req, res) {
  Post.find()
    .sort("-date")
    .populate("user", "name avatar")
    .then(posts => {
      if (posts.length === 0)
        return res.status(400).json({ errors: [{ msg: "No posts" }] });
      res.json(posts);
    })
    .catch(err =>
      res.status(500).json({ errors: [{ msg: "Database error" }] })
    );
});

// @route    GET api/posts/:postid
// @desc     Get post by Post ID
// @access   Private
router.get("/:postid", auth, function(req, res) {
  Post.findById(req.params.postid)
    .populate("user", "name avatar")
    .populate("comments.user", "name avatar")
    .then(post => {
      if (!post)
        return res.status(400).json({ errors: [{ msg: "Post not found" }] });
      res.json(post);
    })
    .catch(err => {
      res.status(500).json({ errors: [{ msg: "Database error" }] });
    });
});

// @route    DELETE api/posts/:postid
// @desc     Delete a post
// @access   Private
router.delete("/:postid", auth, function(req, res) {
  // Post can only be deleted by the post creator/owner, so find post with both post id and user
  Post.findOne({ _id: req.params.postid, user: req.userID })
    .then(post => {
      if (!post)
        return res.status(400).json({ errors: [{ msg: "Post not found" }] });
      post.remove();
      res.json({ msg: "Post removed" });
    })
    .catch(err => {
      res.status(500).json({ errors: [{ msg: "Database error" }] });
    });
});

// @route    PUT api/posts/like/:postid
// @desc     Like a post
// @access   Private
router.put("/like/:postid", auth, function(req, res) {
  Post.findOne({ _id: req.params.postid })
    .then(post => {
      if (!post)
        return res.status(400).json({ errors: [{ msg: "Post not found" }] });

      // each user can only like a post once. If the user already liked the post, return an error
      let likes = post.likes.map(like => like.user);
      if (likes.includes(req.userID)) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Post is already liked" }] });
      }

      return Post.findOneAndUpdate(
        { _id: req.params.postid },
        { $push: { likes: { user: req.userID } } },
        { new: true }
      );
    })
    .then(post => res.json(post))
    .catch(err =>
      res.status(500).json({ errors: [{ msg: "Database error" }] })
    );
});

// @route    PUT api/posts/unlike/:postid
// @desc     Unlike a post
// @access   Private
router.put("/unlike/:postid", auth, function(req, res) {
  Post.findOne({ _id: req.params.postid })
    .then(post => {
      if (!post) {
        return res.status(400).json({ errors: [{ msg: "Post not found" }] });
      }

      // If the user hasn't yet liked the post, return an error
      let likes = post.likes.map(like => like.user);
      if (!likes.includes(req.userID)) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Post is not yet liked" }] });
      }

      let newLikes = post.likes.filter(like => {
        // typeof like.user is object. typeof req.userID is string. So need "toString()" on like.user. Another way is to use "!=" instead of "!==".
        return like.user.toString() !== req.userID;
      });

      return Post.findOneAndUpdate(
        { _id: req.params.postid },
        { $set: { likes: newLikes } },
        { new: true }
      );
    })
    .then(post => res.json(post))
    .catch(err =>
      res.status(500).json({ errors: [{ msg: "Database error" }] })
    );
});

// @route    PUT api/posts/comments/:postid
// @desc     Add comment to a post
// @access   Private
router.put(
  "/comments/:postid",
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

    Post.findOne({ _id: req.params.postid })
      .then(post => {
        if (!post)
          return res.status(400).json({ errors: [{ msg: "Post not found" }] });

        let newComment = {
          text: req.body.text,
          user: req.userID
        };

        return Post.findOneAndUpdate(
          { _id: req.params.postid },
          { $push: { comments: newComment } },
          { new: true }
        );
      })
      .then(post =>
        // for the returned post with updated comments array, populate user field because user details like name, avatar are needed in the front end to display the post
        // And also populate user field inside each comment because user details like name, avatar are needed in the front end to display each comment
        Post.populate(
          post,
          [
            { path: "user", select: "name avatar" },
            { path: "comments.user", select: "name avatar" }
          ],
          function(error, result) {
            if (error)
              return res
                .status(500)
                .json({ errors: [{ msg: "Database error" }] });
            res.json(result);
          }
        )
      )
      .catch(err =>
        res.status(500).json({ errors: [{ msg: "Database error" }] })
      );
  }
);

// @route    PUT api/posts/comments/:postid/:commentid
// @desc     Delete comment
// @access   Private
router.put("/comments/:postid/:commentid", auth, function(req, res) {
  Post.findOne({ _id: req.params.postid })
    .then(post => {
      if (!post)
        return res.status(400).json({ errors: [{ msg: "Post not found" }] });

      let targetComment = post.comments.filter(
        comment => comment._id == req.params.commentid
      );

      if (
        // if comment id doesn't exist
        targetComment.length === 0
      ) {
        return res.status(400).json({ errors: [{ msg: "Comment not found" }] });
      } else if (
        // if comment exists, but doesn't belong to the user who wants to delete
        targetComment[0].user != req.userID
      ) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User not authorized" }] });
      } else {
        // if comment exists, and belongs to the user
        let comments = post.comments;
        comments = comments.filter(
          comment => comment._id != req.params.commentid
        );

        return Post.findOneAndUpdate(
          { _id: req.params.postid },
          { $set: { comments: comments } },
          { new: true }
        );
      }
    })
    .then(post =>
      // for the returned post with updated comments array, populate user field because user details like name, avatar are needed in the front end to display the post
      // And also populate user field inside each comment because user details like name, avatar are needed in the front end to display each comment
      Post.populate(
        post,
        [
          { path: "user", select: "name avatar" },
          { path: "comments.user", select: "name avatar" }
        ],
        function(error, result) {
          if (error)
            return res
              .status(500)
              .json({ errors: [{ msg: "Database error" }] });
          res.json(result);
        }
      )
    )
    .catch(err =>
      // res.status(500).json({ errors: [{ msg: "Database error" }] })
      res.json(err.message)
    );
});

module.exports = router;
