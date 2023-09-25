const jwt = require("jsonwebtoken");
const config = require("config");
const tracker = require("../log/logger");

function admin(req, res, next) {
  try {
    const auth_id = req.get("auth-key");
    if (!auth_id) return res.status(403).send("Invalid  User...Access Denied");
      const user = jwt.verify(auth_id, config.get("pass_key"));
      
      if(!user.isAdmin) return res.status(403).send("Admins only ....✋")
    req.user = user;
    next();
  } catch (err) {
      tracker.error(err.message);
      res.status(400).send("Invalid user.....")
  }
}

module.exports = admin;
