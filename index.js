const express = require("express");
const tracker = require("./log/logger");
const app = express();
const Joi = require("joi");
Joi.objectid = require("joi-objectid")(Joi);

require("./utils/pass_key")();
require("./db/db")();
require("./apps/routes")(app);
require("express-async-errors");

const port = process.env.PORT || 2200;

const server = app.listen(port, () => {
  tracker.info(`Successfully connected to ...${port}`);
});
module.exports = server;
