const { default: mongoose } = require("mongoose");
const config = require("config");
const tracker = require("../log/logger");

module.exports = async function () {
  try {
    const dbUri = config.get("db_uri");
    mongoose.set("strictQuery", false);
    mongoose.connect("mongodb://127.0.0.1/retail");
    tracker.info(`Successfully Connected to DB....${dbUri}`);
  } catch (err) {
    tracker.error("Failed to connect to DB.....", err);
  }
};
