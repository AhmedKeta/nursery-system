/* eslint-disable no-undef */
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  
  try {
    let token = req.get("authorization").split(" ")[1];
    let decodedToken = jwt.verify(token, process.env.SECRET_1);
    req.decodedToken = decodedToken;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports.isAdmin = (req, res, next) => {
  if (req.decodedToken.role === "admin") {
    next();
  } else {
    let error = new Error("Not authrized.");
    error.status = 403;
    next(error);
  }
};

module.exports.isTeacher = (req, res, next) => {
  if (req.decodedToken.role === "teacher") {
    next();
  } else {
    let error = new Error("Not authrized.");
    error.status = 403;
    next(error);
  }
};

module.exports.isSameTeacher = (req, res, next) => {
  if (req.decodedToken.role === "teacher" && req.decodedToken.id === req.body.id) {
    next();
  } else {
    let error = new Error("Not authrized.");
    error.status = 403;
    next(error);
  }
};

module.exports.isAdminOrTeacher = (req, res, next) => {
  if (req.decodedToken.role === "admin" || eq.decodedToken.role === "teacher") {
    next();
  } else {
    let error = new Error("Not authrized.");
    error.status = 403;
    next(error);
  }
};
