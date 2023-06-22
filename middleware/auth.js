const jwt = require("jsonwebtoken");
const config = require("config");
const tracker = require("../log/logger");

function login(req, res, next) {
  try {
    const auth_id = req.get("auth-key");
    if (!auth_id) res.status(403).send("Invalid  User...Access Denied");
    const user = jwt.verify(auth_id, config.get("pass_key"));
    req.user = user;
    next();
  } catch (err) {
    tracker.error(err.message);
  }
}

module.exports = login;
