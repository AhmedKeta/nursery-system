/* eslint-disable no-undef */
const path = require("path");
const express = require("express");
const { param, body } = require("express-validator");
const { isAdmin } = require(path.join(
  __dirname,
  "..",
  "middleware",
  "auth.mw"
));
const controller = require(path.join(
  __dirname,
  "..",
  "controllers",
  "admin.controller"
));
const validationMessager = require(path.join(
  __dirname,
  "..",
  "middleware",
  "validation.mw"
));
const router = express.Router();

router
  .all(isAdmin)
  .route("/admin")
  .get(controller.getAllAdmins)
  .post(
    [
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
        .withMessage("Invalid email address."),
      body("image").isBase64().withMessage("Not valid image.").normalizeEmail(),
    ],
    validationMessager,
    controller.addNewAdmin
  )
  .put(
    [
      body("id")
        .exists()
        .withMessage("Insert ID.")
        .isMongoId()
        .withMessage("admin id must bo added as object ID."),
      body("password").exists().withMessage("Insert your password."),
      body("email").isEmail().withMessage("Invalid email address."),
      body("image").isBase64().withMessage("Not valid image."),
    ],
    validationMessager,
    controller.updateAdmin
  )
  .delete(
    [
      body("id")
        .exists()
        .withMessage("Insert ID.")
        .isInt()
        .withMessage("admin id must bo added as number."),
    ],
    validationMessager,
    controller.deleteAdmin
  );

router
  .all(isAdmin)
  .route("/admin/:id")
  .get(
    [param("id").isInt().withMessage("admin id must bo added as Number.")],
    validationMessager,
    controller.getAdminById
  );

module.exports = router;
