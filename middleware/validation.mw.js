const { validationResult } = require("express-validator");
module.exports = (req, res, next) => {
  let result = validationResult(req);
  if (result.errors.length) {
    let errMsg = result.errors.reduce((msg, obj) => msg + obj.msg + "  ", "");
    let error = new Error(errMsg);
    error.status = 422;
    next(error);
  } else {
    next();
  }
};
