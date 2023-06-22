const config = require("config");
module.exports = function () {
  const privateKey = config.get("pass_key");
  if (!privateKey || privateKey === "")
    throw new Error("Pass key is required before starting the app ...");
};
