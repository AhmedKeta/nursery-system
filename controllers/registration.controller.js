/* eslint-disable no-undef */
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const TeacherModel = mongoose.model("teacher");
const bcrypt = require("bcrypt");
const saltRounds = 12;
const mailer = require("nodemailer");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
  const tokenKey = process.env.SECRET_1;


// const emailTemplate = require(path.join(__dirname, "..", "view", "email-validation.html"))
// const sendgridTransport = require("nodemailer-sendgrid-transport");
// const sgMail = require("@sendgrid/mail");

exports.addNewTeacher = (req, res, next) => {
  let newTeacher = new TeacherModel({
    fullName: req.body.fullName,
    email: req.body.email,
    image: req.body.image,
    active: false,
    activateToken: req.activateToken,
    activateTokenExp: req.activateTokenExp,
  });
  bcrypt
    .hash(req.body.password, saltRounds)
    .then((hash) => {
      newTeacher.password = hash;
      return newTeacher.save();
    })
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => next(err));
};
//ToDo
exports.emailValidation = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      next(err);
    }
    const token = buffer.toString("hex");
    req.activateToken = token;
    req.activateTokenExp = Date.now() + 3600000;
    let transporter = mailer.createTransport({
      service: "outlook",
      auth: {
        user: "ahmedketa12@gmail.com", //ToDo
        pass: "Nonoman23", //ToDo
      },
    });
    let mailOptions = {
      type: "OAUTH2",
      from: "ahmedketa12@gmail.com",
      to: req.body.email,
      subject: "Email activation",
      html:
        // fs.readFileSync(
        //   path.join(__dirname, "..", "view", "email-validation.html")) +
        `<a href="localhost:8080/reset/${token}">localhost:8080/reset/${token}</a>`,
      // text: "Welcome frome Node.js",
    };
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        next(err);
      } else {
        next();
      }
    });
  });
};

exports.getActive = (req, res, next) => {
  TeacherModel
    .findOne({ activateToken: req.params.token })
    .then((teacher) => {
      if (!teacher) {
        let error = new Error("No teacher with this active token");
        error.status(401);
        throw error;
      } else if (teacher.activateTokenExp < Date.now) {
        let error = new Error("Expired Token");
        error.status(401);
        throw error;
      } else {
        req.id = teacher._id;
        teacher.active = true;
        return teacher.save();
      }
    })
    .then(() => {
      let token = jwt.sign(
        {
          id: req.id,
          role: "teacher",
        },
        tokenKey,
        { expiresIn: "8h" }
      );
      res.status(200).json({ message: "ok", token }); //ToDo (Direct to home Page with token)
    })
    .catch((err) => {
      next(err);
    });
};
