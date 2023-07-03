module.exports = (req, res, next) => {
  if ((req.method === "GET" || req.method === "DELETE") && req.body) {
    const err = new Error("Body not allowed for GET or DELETE requests");
    err.status = 400;
    return next(err);
  }

  const contentLength = req.headers["content-length"];
  if (contentLength && parseInt(contentLength) > 1000000) {
    const err = new Error("Request entity too large");
    err.status = 413;
    return next(err);
  }
  next();


  // auth mw
  // is admin for dry
  // const allowedRoutes = [
  //   { path: "/admin", methods: ["POST", "GET", ] },
  //   { path: "/api/public", methods: ["GET"] },
  // ];
  // const allowed = allowedRoutes.some((route) => {
  //   const pathMatches = req.path === route.path;
  //   const methodMatches = route.methods.includes(req.method);
  //   return pathMatches && methodMatches;
  // });

  // if (!allowed) {
  //   const err = new Error("Unauthorized route or method");
  //   err.status = 401;
  //   return next(err);
  // }

  //  reCAPTCHA
  //   const fetch = require('node-fetch');

  // const verifyRecaptcha = async (response, remoteip) => {
  //   const secret = 'YOUR_SECRET_KEY';
  //   const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${response}&remoteip=${remoteip}`;

  //   const res = await fetch(url);
  //   const data = await res.json();

  //   return data.success;
  // };
  // ```

  // This function sends a POST request to the [reCAPTCHA verification endpoint](poe://www.poe.com/_api/key_phrase?phrase=reCAPTCHA%20verification%20endpoint&prompt=Tell%20me%20more%20about%20reCAPTCHA%20verification%20endpoint.) with the user's response, your [secret key](poe://www.poe.com/_api/key_phrase?phrase=secret%20key&prompt=Tell%20me%20more%20about%20secret%20key.), and the user's IP address. It then returns a [boolean value](poe://www.poe.com/_api/key_phrase?phrase=boolean%20value&prompt=Tell%20me%20more%20about%20boolean%20value.) indicating whether the response is valid.

  // multi-factor authentication (MFA)
  //   const speakeasy = require('speakeasy');
  // const qrcode = require('qrcode');

  // // Generate a secret key for the user
  // const secret = speakeasy.generateSecret();

  // // Save the secret key to the user's account in your database
  // user.secretKey = secret.base32;

  // // Generate a QR code for the user to scan with their authenticator app
  // const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

  // // Send the QR code URL to the user via email or other secure channel
  // sendQrCodeUrlToUser(user.email, qrCodeUrl);

  // // When the user logs in, prompt them to enter a one-time password (OTP)
  // const otp = req.body.otp;

  // // Verify the OTP using the secret key saved in the user's account
  // const verified = speakeasy.totp.verify({
  //   secret: user.secretKey,
  //   encoding: 'base32',
  //   token: otp,
  // });

  // if (verified) {
  //   // Allow the user to log in
  //   res.send('Login successful');
  // } else {
  //   // Prompt the user to try again or use a different authentication method
  //   res.status(401).send('Invalid OTP');
  // }

  // log in attemps
  // save in db;
  // const MAX_LOGIN_ATTEMPTS = 5;
  // const LOCKOUT_DURATION_MINUTES = 15;

  // // Custom middleware function to check if the user's account is locked out
  // const accountLockoutMW = (req, res, next) => {
  //   const now = Date.now();
  //   const lastFailedLogin = req.user.lastFailedLogin || 0;
  //   const failedLoginAttempts = req.user.failedLoginAttempts || 0;

  //   if (
  //     failedLoginAttempts >= MAX_LOGIN_ATTEMPTS &&
  //     now - lastFailedLogin < LOCKOUT_DURATION_MINUTES * 60 * 1000
  //   ) {
  //     // The user's account is locked out
  //     const err = new Error(
  //       "Account locked out due to too many failed login attempts"
  //     );
  //     err.status = 401;
  //     return next(err);
  //   }

  //   next();
  // };

  // // Custom middleware function to update the user's failed login attempts and last failed login timestamp
  // const updateFailedLoginAttemptsMW = (req, res, next) => {
  //   if (req.user && !req.isAuthenticated()) {
  //     req.user.failedLoginAttempts = (req.user.failedLoginAttempts || 0) + 1;
  //     req.user.lastFailedLogin = Date.now();
  //     req.user.save();
  //   }

  //   next();
  // };

  // // Add the middleware functions to the middleware chain
  // app.use(updateFailedLoginAttemptsMW);
  // app.use(accountLockoutMW);

  // automated brute force attacks
  // const rateLimit = require("express-rate-limit");
  // const { v4: uuidv4 } = require("uuid");
  // const axios = require("axios");

  // const CAPTCHA_SECRET = "YOUR_CAPTCHA_SECRET_KEY";

  // // Custom middleware function to verify the CAPTCHA response
  // const verifyCaptchaMW = async (req, res, next) => {
  //   const captchaResponse = req.body["g-recaptcha-response"];
  //   const remoteIp = req.connection.remoteAddress;

  //   try {
  //     const response = await axios.post(
  //       "https://www.google.com/recaptcha/api/siteverify",
  //       null,
  //       {
  //         params: {
  //           secret: CAPTCHA_SECRET,
  //           response: captchaResponse,
  //           remoteip: remoteIp,
  //         },
  //       }
  //     );

  //     if (response.data.success) {
  //       next();
  //     } else {
  //       const err = new Error("Invalid CAPTCHA response");
  //       err.status = 401;
  //       next(err);
  //     }
  //   } catch (err) {
  //     next(err);
  //   }
  // };

  // // Add the rate limiter and CAPTCHA verification middleware to the login route
  // app.post(
  //   "/login",
  //   rateLimit({
  //     windowMs: 5 * 60 * 1000, // 5 minutes
  //     max: 10, // Max 10 requests per 5 minutes
  //     keyGenerator: (req) => {
  //       // Generate a unique key for each user based on their IP address and user agent
  //       return `${req.ip}:${req.headers["user-agent"]}`;
  //     },
  //     handler: (req, res) => {
  //       res.status(429).send("Too many requests. Please try again later.");
  //     },
  //   }),
  //   verifyCaptchaMW,
  //   (req, res) => {
  //     // Handle login logic here
  //     // ...
  //     res.send("Login successful");
  //   }
  // );

  // reset password
  // const speakeasy = require("speakeasy");
  // const nodemailer = require("nodemailer");

  // // Generate a secret key for the user
  // const secret = speakeasy.generateSecret();

  // // Save the secret key to the user's account in your database
  // user.secretKey = secret.base32;

  // // Generate a one-time password (OTP) for the user
  // const otp = speakeasy.totp({
  //   secret: user.secretKey,
  //   encoding: "base32",
  // });

  // // Send the OTP to the user's email address
  // const transporter = nodemailer.createTransport({
  //   service: "gmail",
  //   auth: {
  //     user: "YOUR_GMAIL_ADDRESS",
  //     pass: "YOUR_GMAIL_PASSWORD",
  //   },
  // });

  // const mailOptions = {
  //   from: "YOUR_GMAIL_ADDRESS",
  //   to: user.email,
  //   subject: "Password Reset OTP",
  //   text: `Your one-time password (OTP) for resetting your password is ${otp}. Please enter this OTP in the password reset form.`,
  // };

  // transporter.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     console.error(error);
  //   } else {
  //     console.log(`Password reset OTP sent to ${user.email}: ${otp}`);
  //   }
  // });

  // // When the user enters the OTP, verify it and allow them to reset their password
  // const enteredOtp = req.body.otp;

  // const verified = speakeasy.totp.verify({
  //   secret: user.secretKey,
  //   encoding: "base32",
  //   token: enteredOtp,
  // });

  // if (verified) {
  //   // Allow the user to reset their password
  //   user.password = req.body.newPassword;
  //   user.save();
  //   res.send("Password reset successful");
  // } else {
  //   // Prompt the user to try again or use a different authentication method
  //   res.status(401).send("Invalid OTP");
  // }



  //extra
  // const validator = require("validator");

  // const email = req.body.email;

  // // Check if the email address is valid
  // if (!validator.isEmail(email)) {
  //   res.status(400).send("Invalid email address");
  //   return;
  // }

  // // Check if the domain name is valid and accepting email
  // validator.isFQDN(
  //   validator.splitEmail(email)[1],
  //   {
  //     require_tld: true,
  //     allow_underscores: true,
  //     allow_trailing_dot: true,
  //     allow_numeric_tld: true,
  //     allow_unqualified: false,
  //   },
  //   (err, result) => {
  //     if (err) {
  //       console.error(err);
  //       res.status(500).send("Server error");
  //     } else if (!result) {
  //       res.status(400).send("Invalid email domain");
  //     } else {
  //       // Send the OTP to the user's email address
  //       // ...
  //     }
  //   }
  // );




//   allow countries
//   const geoip = require('geoip-lite');

// function restrictToCountries(countries) {
//   return function(req, res, next) {
//     const ip = req.ip || req.connection.remoteAddress;
//     const country = geoip.lookup(ip)?.country;

//     if (countries.includes(country)) {
//       next();
//     } else {
//       res.status(403).send('Access denied');
//     }
//   }
// }const express = require('express');
// const app = express();

// app.use(restrictToCountries(['US', 'CA'])); // allow access only from US and Canada

// app.get('/api/data', (req, res) => {
//   // handle the request
  // });
  


// DoS attack
//   const rateLimit = require("express-rate-limit");

//   const limiter = rateLimit({
//     windowMs: 60 * 1000, // 1 minute
//     max: 100, // limit each IP to 100 requests per minute
//   });

  //   app.use(limiter);
  





  //cash
  // const express = require("express");
  // const NodeCache = require("node-cache");

  // const cache = new NodeCache();
  // const app = express();

  // app.get("/api/data", (req, res) => {
  //   const key = req.originalUrl || req.url;
  //   const cachedData = cache.get(key);

  //   if (cachedData) {
  //     return res.send(cachedData);
  //   }

  //   const newData = // fetch new data from database or API
  //     cache.set(key, newData);
  //   res.send(newData);
  // });




  // task queue
  // const Queue = require("bull");

  // const myQueue = new Queue("myQueue");

  // myQueue.process((job, done) => {
  //   // do the long-running or resource-intensive task
  //   done();
  // });

  // app.post("/api/task", async (req, res) => {
  //   await myQueue.add({
  //     /* task data */
  //   });
  //   res.send("Task added to queue");
  // });




//   winston mw
//   const winston = require('winston');

// const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.json(),
//   defaultMeta: { service: 'my-app' },
//   transports: [
//     new winston.transports.File({ filename: 'error.log', level: 'error' }),
//     new winston.transports.File({ filename: 'combined.log' })
//   ]
// });

// function logRequest(req, res, next) {
//   logger.info({
//     message: 'Request received',
//     method: req.method,
//     url: req.url,
//     ip: req.ip
//   });

//   res.on('finish', () => {
//     logger.info({
//       message: 'Request completed',
//       method: req.method,
//       url: req.url,
//       ip: req.ip,
//       status: res.statusCode
//     });
//   });

//   next();
  // }

// in error mw
  // const express = require("express");
  // const app = express();

  // app.use(logRequest);

  // app.get("/api/data", (req, res) => {
  //   // handle the request
  // });

  // app.use((err, req, res, next) => {
  //   logger.error({
  //     message: "Error occurred",
  //     method: req.method,
  //     url: req.url,
  //     ip: req.ip,
  //     error: err.stack,
  //   });

  //   res.status(500).send("Internal server error");
  // });




// transaction with mongo to make sure all or nothing
//   const session = await mongoose.startSession();
// session.startTransaction();

// try {
//   // Perform multiple CRUD operations inside the transaction
//   await Model1.create({/* data */}, { session });
//   await Model2.updateOne({/* query */}, {/* update */}, { session });
//   await Model3.deleteOne({/* query */}, { session });

//   // Commit the transaction if all operations are successful
//   await session.commitTransaction();
// } catch (error) {
//   // Abort the transaction if any operation fails
//   await session.abortTransaction();
//   console.error(error);
// } finally {
//   // End the session
//   session.endSession();
  // }
  


  //We can add key to request for rondom cors attack
};



// https://e8cd-197-43-109-48.eu.ngrok.io/55 /////////////////////
