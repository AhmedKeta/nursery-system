/* eslint-disable no-undef */
const path = require("path");
const express = require("express");
const { param, body } = require("express-validator");
const controller = require(path.join(
  __dirname,
  "..",
  "controllers",
  "class.controller"
));
const { isAdminOrTeacher } = require(path.join(
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
  .all(isAdminOrTeacher)
  .route("/class")
  .get(controller.getAllClasses)
  .post(
    [
      body("name")
        .exists()
        .withMessage("Class name must be added.")
        .isLength({ min: 5, max: 35 })
        .withMessage("Name must be between 5 to 35 char long.")
        .isString()
        .withMessage("Class name  must be (str)"),
      body("supervisor")
        .exists()
        .withMessage("Class supervisor must be added.")
        .isMongoId()
        .withMessage("Class supervisor is must to be (Object ID)."),
      body("children")
        .exists()
        .withMessage("Class children must be added.")
        .isArray()
        .withMessage("Class children is must to be (arr).")
        .custom((value) => {
          for (child of value) {
            if (isNaN(child)) {
              return false;
            }
          }
          return true;
        })
        .withMessage("Class children is must to be an array of IDs (Number)"),
    ],
    validationMessager,
    controller.addNewClass
  )
  .put(
    [
      body("id")
        .exists()
        .withMessage("Class id must be added.")
        .isInt()
        .withMessage("Class name  must be (Number)"),
      body("name")
        .optional()
        .isLength({ min: 5, max: 35 })
        .withMessage("Name must be between 5 to 35 char long.")
        .isString()
        .withMessage("Class name  must be (str)"),
      body("supervisor")
        .optional()
        .optional()
        .isInt()
        .withMessage("Class supervisor is must to be (Number)."),
      body("children")
        .optional()
        .optional()
        .isArray()
        .withMessage("Class children is must to be (arr).")
        .custom((value) => {
          for (child of value) {
            if (isNaN(child)) {
              return false;
            }
          }
          return true;
        })
        .withMessage("Class children is must to be an array of IDs (Number)"),
    ],
    validationMessager,
    controller.updateClass
  )
  .delete(
    [
      body("id")
        .exists()
        .withMessage("Class id must be added.")
        .isInt()
        .withMessage("Class name  must be (Number)"),
    ],
    validationMessager,
    controller.deleteClass
  );

router
  .all(isAdminOrTeacher)
  .route("/class/:id")
  .get(
    [param("id").isInt().withMessage("Class id is must to be (int).")],
    validationMessager,
    controller.getClassById
  );

router
  .all(isAdminOrTeacher)
  .route("/class/:id/child")
  .get(
    [param("id").isInt().withMessage("Class id is must to be (int).")],
    validationMessager,
    controller.getClassChildrenInfo
  );

router
  .all(isAdminOrTeacher)
  .route("/class/:id/teacher")
  .get(
    [param("id").isInt().withMessage("Class id is must to be (int).")],
    validationMessager,
    controller.getClassSupervisorInfo
  );

module.exports = router;
