const config = require("config");
const tracker = require("../log/logger");
module.exports = function () {
  const privateKey = config.get("pass_key");
  const mail_account = config.get("mail_account");
  const mail_pass = config.get("mail_pass");
  if (!privateKey) {
    tracker.error("Required App config  variables not set ....");
    throw new Error(
      "Pass key, Mail Account, and Mail password are required before starting the app ..."
    );
  }
};
