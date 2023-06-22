const winston = require("winston");
const { colorize, combine, simple, json, prettyPrint } = winston.format;

const trackerTransports = {
  errorLog: new winston.transports.File({
    filename: "error.log",
    level: "error",
  }),
  retailerLog: new winston.transports.File({
    filename: "retailer.log",
    level: "info",
  }),
  consoleLog: new winston.transports.Console({
    level: "info",
  }),
  exceptionLog: new winston.transports.File({
    filename: "exceptions.log",
    level: "error",
    handleExceptions: true,
    handleRejections: true,
  }),
};
const { errorLog, exceptionLog, retailerLog, consoleLog } = trackerTransports;
module.exports = trackerTransports;
