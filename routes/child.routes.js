/* eslint-disable no-undef */
const path = require("path");
const express = require("express");
const { param, body } = require("express-validator");
const { isAdminOrTeacher } = require(path.join(
  __dirname,
  "..",
  "middleware",
  "auth.mw"
));
const controller = require(path.join(
  __dirname,
  "..",
  "controllers",
  "child.controller"
));
const validationMessager = require(path.join(
  __dirname,
  "..",
  "middleware",
  "validation.mw"
));
const router = express.Router();

router
  .all(isAdminOrTeacher)
  .route("/child")
  .get(controller.getAllChildren)
  .post(
    [
      body("fullName")
        .exists()
        .withMessage("Child name must be inserted.")
        .isString()
        .withMessage("Valid name please!!")
        .isLength({ min: 5, max: 35 })
        .withMessage("Name must be between 5 to 35 char long."),
      body("birthDate")
        .exists()
        .withMessage("Birth date must be inserted.")
        .isDate({ format: "DD-MM-YYYY" })
        .withMessage("Not valid date!!"),
      body("level")
        .exists()
        .withMessage("Level must be inserted.")
        .isIn(["PreKG", "KG1", "KG2"])
        .withMessage("Only valid levels (PreKG - KG1 - KG2)"),
      body("address")
        .exists()
        .withMessage("Address must be inserted.")
        .isObject({ strict: true }),
      body("address.city")
        .exists()
        .withMessage("Address city must be inserted.")
        .isString()
        .withMessage("Address city not valid."),
      body("address.street")
        .exists()
        .withMessage("Address street must be inserted.")
        .isString()
        .withMessage("Address street not valid."),
      body("address.building")
        .exists()
        .withMessage("Address building must be inserted.")
        .isString()
        .withMessage("Address building not valid."),
    ],
    validationMessager,
    controller.addNewChild
  )
  .put(
    [
      body("id")
        .exists()
        .withMessage("Child id must bo added")
        .isInt()
        .withMessage("Child id must bo added as Number."),
      body("fullName")
        .optional()
        .isString()
        .withMessage("Valid name please!!")
        .isLength({ min: 5, max: 35 })
        .withMessage("Name must be between 5 to 35 char long."),
      body("level")
        .optional()
        .isIn(["PreKG", "KG1", "KG2"])
        .withMessage("Only valid levels (PreKG - KG1 - KG2)"),
      body("address")
        .optional()
        .isObject({ strict: true })
        .withMessage("Adress must be object."),
      body("address.city")
        .optional()
        .isString()
        .withMessage("Address city not valid."),
      body("address.street")
        .optional()
        .isString()
        .withMessage("Address street not valid."),
      body("address.building")
        .optional()
        .isString()
        .withMessage("Address building not valid."),
    ],
    validationMessager,
    controller.updateChild
  )
  .delete(
    [
      body("id")
        .exists()
        .withMessage("Insert ID.")
        .isInt()
        .withMessage("Child id must bo added as Number."),
    ],
    validationMessager,
    controller.deleteChild
  );

router
  .all(isAdminOrTeacher)
  .route("/child/:id")
  .get(
    [param("id").isInt().withMessage("Child id must bo added as Number.")],
    validationMessager,
    controller.getChildById
  );

router
  .all(isAdminOrTeacher)
  .route("/child/:id/class")
  .get(
    [param("id").isInt().withMessage("Child id must bo added as Number.")],
    validationMessager,
    controller.getChildClassInfo
  );

module.exports = router;
