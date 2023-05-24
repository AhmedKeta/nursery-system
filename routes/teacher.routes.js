/* eslint-disable no-undef */
const path = require("path");
const express = require("express");
const { param, body } = require("express-validator");
const multerMW = require(path.join(__dirname, "..", "middleware", "multer.mw"));
const controller = require(path.join(
  __dirname,
  "..",
  "controllers",
  "teacher.controller"
));
const { isAdmin, isSameTeacher, isTeacher } = require(path.join(
  __dirname,
  "..",
  "middleware",
  "auth.mw"
));
const validationMessager = require(path.join(
  __dirname,
  "..",
  "middleware",
  "validation.mw"
));
const router = express.Router();

router
  .route("/teacher")
  .put(
    isSameTeacher,
    [
      body("id")
        .exists()
        .withMessage("Insert ID.")
        .isMongoId()
        .withMessage("teacher id must bo added as object ID."),
      body("password").exists().withMessage("Insert your password."),
      body("fullName")
        .optional()
        .isString()
        .withMessage("Valid name please!!")
        .isLength({ min: 5, max: 35 })
        .withMessage("Name must be between 5 to 35 char long."),
      body("image").optional().isBase64().withMessage("Not valid image."),
      body("email").optional().isEmail().withMessage("Invalid email address."),
    ],
    validationMessager,
    controller.updateTeacher
  )
  .delete(
    isAdmin,
    [
      body("id")
        .exists()
        .withMessage("Insert ID.")
        .isMongoId()
        .withMessage("teacher id must bo added as object ID."),
    ],
    validationMessager,
    controller.deleteTeacher
  );

router
  .route("/teacher/:id")
  .get(
    isAdmin,
    [
      param("id")
        .isMongoId()
        .withMessage("teacher id must bo added as object ID."),
    ],
    validationMessager,
    controller.getTeacherById
  );

router.route("/teacher/page/:page").get(isAdmin, controller.getAllTeachers);

router.route("/:id/supervise").get(isAdmin, controller.getAllClassSupervisors);
router
  .route("/uploadImg")
  .post(multerMW, isTeacher, controller.uploadTeacherImg);
// router.route("/uploadImg").post(isTeacher, controller.uploadTeacherImg);
// router.route("/getImg").get(isTeacher, controller.getTeacherImg);

module.exports = router;
