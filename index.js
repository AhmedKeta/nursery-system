/* eslint-disable no-undef */
/* eslint-disable quotes */
const path = require("path");
const database = require(path.join(__dirname, "util", "database"));
const express = require("express");
const morgan = require("morgan");

require(path.join(__dirname, "models", "model-require"));
const corsMW = require(path.join(__dirname, "middleware", "cors.mw"));
const winston = require(path.join(__dirname, "logs", "winston", "config"));
const authMW = require(path.join(__dirname, "middleware", "auth.mw"));
const errorMW = require(path.join(__dirname, "middleware", "error.mw"));
const compression = require("compression");
require("dotenv").config();
const authenticationRoute = require(path.join(
  __dirname,
  "routes",
  "authentication.routes"
));
const adminRoute = require(path.join(__dirname, "routes", "admin.routes"));
const teacherRoute = require(path.join(__dirname, "routes", "teacher.routes"));
const childRoute = require(path.join(__dirname, "routes", "child.routes"));
const classRoute = require(path.join(__dirname, "routes", "class.routes"));
const registrationRoute = require(path.join(
  __dirname,
  "routes",
  "registration.routes"
));
const notFoundRoute = require(path.join(__dirname, "routes", "404.routes"));
const app = express();
const port = process.env.PORT;

// app.use("/images", express.static(path.join(__dirname, "images"))) //access from clint
app.use(
  morgan(
    "url: :url\nmethod: :method\nStatus: :status\ncontent-length: :res[content-length] - response-time: :response-time ms",
    { stream: winston.stream }
  )
);
app.use(corsMW);
app.use(compression());
app.use(express.json());
app.use(authenticationRoute);
app.use(registrationRoute);
app.use(authMW);
app.use(adminRoute);
app.use(teacherRoute);
app.use(childRoute);
app.use(classRoute);
app.use(notFoundRoute);
app.use(errorMW);

database.mongoConnect(() => {
  app.listen(port, () => {
    console.log("Express is listening ........");
  });
});
