/* eslint-disable no-undef */
const path = require("path");
const express = require("express");
const controller = require(path.join(
  __dirname,
  "..",
  "controllers",
  "authentication.controller"
));
const router = express.Router();

router.route("/login").post(controller.login);
router.route("/login/admin").post(controller.loginAdmin);
router.route("/reset").post(controller.postReset);
router.route("/reset/:token").get(controller.getReset);
router.route("/reset/:token").get(controller.getReset);

module.exports = router;
