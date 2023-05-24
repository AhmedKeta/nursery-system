/* eslint-disable no-undef */
const path = require("path");
const express = require("express");
const { body } = require("express-validator");
const controller = require(path.join(
  __dirname,
  "..",
  "controllers",
  "registration.controller"
));
const validationMessager = require(path.join(
  __dirname,
  "..",
  "middleware",
  "validation.mw"
));
const router = express.Router();
router.route("/teacher").post(
  [
    body("fullName")
      .exists()
      .withMessage("Teacher name must be inserted.")
      .isString()
      .withMessage("Valid name please!!")
      .isLength({ min: 5, max: 35 })
      .withMessage("Name must be between 5 to 35 char long."),
    body("password")
      .exists()
      .withMessage("Password must be inserted.")
      .isStrongPassword({
        minLength: 0,
      })
      .withMessage(
        "Weak password!!Password should be combination of one uppercase , one lower case, one special char and one digit."
      )
      .isLength({ max: 35, min: 8 })
      .withMessage("password must be between 8 to 35 char long."),
    body("passwordConfirmation")
      .exists()
      .withMessage("Password confirmation must be inserted.")
      .custom((value, { req }) => {
        return value === req.body.password;
      })
      .withMessage("Confirm password with same password."),
    body("email")
      .exists()
      .withMessage("Email name must be inserted.")
      .isEmail()
      .withMessage("Invalid email address.")
      .normalizeEmail(),
  ],
  validationMessager,
  controller.emailValidation,
  controller.addNewTeacher
);
router.route("/active/:token").get(controller.getActive);

module.exports = router;
