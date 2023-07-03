/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const path = require("path");
const winston = require(path.join(
  __dirname,
  "..",
  "logs",
  "winston",
  "config"
));

module.exports = (error, req, res, next) => {
  winston.error(
    `Error: ${error.status || 500} message: ${
      error || "500 Internal Server Error"
    }`
  );
  res.status(error.status || 500);
  res.json({ message: error + "" || "500 Internal Server Error" });
};
