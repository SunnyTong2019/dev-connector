const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSecret = config.get("jwtSecret");
const User = require("../models/User");

function verifyToken(req, res, next) {
  try {
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, jwtSecret);
    const userID = decoded.userID;

    User.findOne({ _id: userID }, (err, user) => {
      if (err) {
        return res.status(500).json({ errors: [{ msg: "Database Error" }] });
      }

      if (!user) {
        return res
          .status(422)
          .json({ errors: [{ msg: "User doesn't exist" }] });
      }

      next();
    });
  } catch (err) {
    return res.status(422).json({ errors: [{ msg: "Invalid Token" }] });
  }
}

module.exports = verifyToken;
