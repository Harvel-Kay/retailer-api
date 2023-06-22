const tracker = require("../log/logger");

module.exports = function error_handler(err, req, res, next) {
  tracker.error(err.message, err);

  res.status(500).send("Server Timeout");
};
