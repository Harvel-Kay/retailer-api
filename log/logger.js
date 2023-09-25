const winston = require("winston");
const { colorize, combine, simple, json, prettyPrint } = winston.format;

const {
  errorLog,
  exceptionLog,
  retailerLog,
  consoleLog,
} = require("./transports");

const tracker = winston.createLogger({
  exitOnError: false,
  transports: [errorLog, exceptionLog, retailerLog, consoleLog],
  level: "info",
  format: combine(json(), colorize(), simple()),
  defaultMeta: true,
});

module.exports = tracker;
