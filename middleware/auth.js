const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSecret = config.get("jwtSecret");

function verifyToken(req, res, next) {
  try {
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, jwtSecret);
    const userID = decoded.userID;
    req.userID = userID;
    next();
  } catch (err) {
    return res.status(422).json({ errors: [{ msg: "Invalid Token" }] });
  }
}

module.exports = verifyToken;
