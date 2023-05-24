/* eslint-disable no-undef */
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const teacherModel = mongoose.model("teacher");
const adminModel = mongoose.model("admin");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mailer = require("nodemailer");

const tokenKey = process.env.SECRET_1;

exports.login = (req, res, next) => {
  teacherModel
    .findOne({ email: req.body.email })
    .then((teacher) => {
      if (teacher) {
        if (teacher.active) {
          req.body.id = teacher._id;
          return bcrypt.compare(req.body.password, teacher.password);
        } else {
          let error = new Error("Activate your email please.");
          error.status = 401;
          throw error;
        }
      } else {
        let error = new Error("Email or password is wrong.");
        error.status = 401;
        throw error;
      }
    })
    .then((result) => {
      if (result) {
        let token = jwt.sign(
          {
            id: req.body.id,
            role: "teacher",
          },
          tokenKey,
          { expiresIn: "8h" }
        );
        res.status(200).json({ message: "ok", token });
      } else {
        let error = new Error("Email or password is wrong.");
        error.status = 401;
        throw error;
      }
    })
    .catch((err) => next(err));
};

exports.loginAdmin = (req, res, next) => {
  adminModel
    .findOne({ email: req.body.email })
    .then((admin) => {
      if (admin) {
        req.body.id = admin._id;
        return bcrypt.compare(req.body.password, admin.password);
      } else {
        let error = new Error("Email or password is wrong.");
        error.status = 401;
        throw error;
      }
    })
    .then((result) => {
      if (result) {
        let token = jwt.sign(
          {
            id: req.body.id,
            role: "admin",
          },
          tokenKey,
          { expiresIn: "8h" }
        );
        res.status(200).json({ message: "ok", token });
      } else {
        let error = new Error("Email or password is wrong.");
        error.status = 401;
        throw error;
      }
    })
    .catch((err) => next(err));
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      next(err);
    }
    const token = buffer.toString("hex");
    teacherModel
      .findOne({ email: req.body.email })
      .then((teacher) => {
        if (!teacher) {
          let error = new Error("Email Not found");
          error.status = 401;
          throw error;
        }
        teacher.activateToken = token;
        teacher.activateTokenExp = Date.now() + 3600000;
        return teacher.save();
      })
      .then(() => {
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
          subject: "Password reset",
          html:
            // fs.readFileSync(
            //   path.join(__dirname, "..", "view", "email-validation.html")
            // ) +
            `<a href="localhost:8080/active/${token}">localhost:8080/active/${token}</a>`,
          // text: "Welcome frome Node.js",
        };
        transporter.sendMail(mailOptions, (err) => {
          if (err) {
            next(err);
          } else {
            res.status(200).json({ message: "Email sent" });
          }
        });
      })
      .catch((err) => next(err));
  });
};

exports.getReset = (req, res, next) => {
  teacherModel
    .findOne({ activateToken: req.params.token })
    .then((teacher) => {
      if (!teacher) {
        let error = new Error("No teacher with this reset token");
        error.status(401);
        throw error;
      } else if (teacher.activateTokenExp < Date.now) {
        let error = new Error("Expired Token");
        error.status(401);
        throw error;
      } else if (teacher.active) {
        let token = jwt.sign(
          {
            id: teacher._id,
            role: "teacher",
          },
          tokenKey,
          { expiresIn: "8h" }
        );
        res.status(200).json({ message: "ok", token }); //ToDo (Direct to reset Page with token)
      } else {
        let error = new Error("Activate your email please.");
        error.status = 401;
        throw error;
      }
    })
    .catch((err) => {
      next(err);
    });
};

