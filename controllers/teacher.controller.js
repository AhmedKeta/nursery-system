/* eslint-disable no-undef */
const mongoose = require("mongoose");
const TeacherModel = mongoose.model("teacher");
const ClassModel = mongoose.model("class");
const bcrypt = require("bcrypt");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const saltRounds = 12;
const teachersPerPage = process.env.teachersPerPage;

exports.getAllTeachers = (req, res, next) => {
  TeacherModel.find({}, { fullName: 1, email: 1, image: 1 })
    .skip((req.params.page - 1) * teachersPerPage)
    .limit(teachersPerPage)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => next(err));
};

exports.getTeacherById = (req, res, next) => {
  TeacherModel.findOne(
    { _id: req.params.id },
    { fullName: 1, email: 1, image: 1 }
  )
    .then((data) => {
      if (!data) {
        throw new Error("No teacher with this id!!");
      }
      res.status(200).json(data);
    })
    .catch((err) => next(err));
};

exports.addNewTeacher = (req, res, next) => {
  let newTeacher = new TeacherModel({
    fullName: req.body.fullName,
    email: req.body.email,
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

exports.updateTeacher = (req, res, next) => {
  let updatedTeacher = {
    fullName: req.body.fullName,
    email: req.body.email,
  };
  bcrypt
    .hash(req.body.password, saltRounds)
    .then((hash) => {
      updatedTeacher.password = hash;
      return TeacherModel.updateOne(
        { _id: req.body.id },
        { $set: updatedTeacher }
      );
    })
    .then((data) => {
      if (data.matchedCount) {
        res.status(201).json(data);
      } else {
        throw new Error("No teacher with this id!!");
      }
    })
    .catch((err) => next(err));
};

exports.deleteTeacher = (req, res, next) => {
  ClassModel.findOne({ supervisor: req.body.id })
    .then((data) => {
      if (data) {
        throw new Error("This teacher is supervisor to a class.");
      } else {
        return TeacherModel.deleteOne({ _id: req.body.id });
      }
    })
    .then((data) => {
      if (data.deletedCount === 1) {
        res.status(201).json(data);
      } else {
        throw new Error("This teacher does not exist.");
      }
    })
    .catch((err) => next(err));
};

exports.getAllClassSupervisors = (req, res, next) => {
  ClassModel.find({ supervisor: req.params.id })
    .then((data) => {
      if (data) {
        throw new Error("This teacher is not supervisor to a class.");
      } else {
        res.status(200).json(data);
      }
    })
    .catch((err) => next(err));
};

exports.uploadTeacherImg = (req, res, next) => {
  const image = req.file;
  if (!image) {
    let error = new Error("Not valid image.");
    error.status = 422;
    next(error);
  } else {
    TeacherModel.updateOne({ _id: req.decodedToken.id }, { image: image.path })
      .then((result) => {
        res.status(201).json(result);
      })
      .catch((err) => next(err));
  }
};

exports.uploadTeacherImg = async (req, res, next) => {
  const image = req.file;
  if (!image) {
    let error = new Error("Not valid image.");
    error.status = 422;
    next(error);
  } else {
    cloudinary.config({
      secure: true,
      cloud_name: process.env.cloudName,
      api_key: process.env.cloudKey,
      api_secret: process.env.cloudSecret,
      private_cdn: false,
      secure_distribution: null,
    });
    /////////////////////////
    // Uploads an image file
    /////////////////////////
    const uploadImage = async (imagePath) => {
      // Use the uploaded file's name as the asset's public ID and
      // allow overwriting the asset with new versions
      const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      };

      try {
        // Upload the image
        const result = await cloudinary.uploader.upload(imagePath, options);
        return result.secure_url;
      } catch (error) {
        console.error(error);
      }
    };

    const imageUrl = await uploadImage(image.path);
    fs.unlinkSync(image.path);
    TeacherModel.updateOne({ _id: req.decodedToken.id }, { image: imageUrl })
      .then((result) => {
        res.status(201).json(result);
      })
      .catch((err) => next(err));
  }
};

// exports.getTeacherImg = (req, res, next) => {
//   // TeacherModel.findOne({ _id: req.decodedToken.id }, { image: 1 })
//   //   .then((teacher) => {
//   //     return fs.readFile(teacher.image);
//   //   })
//   //   .then((image) => {
//   //     res.status(200).json(image);
//   //   })
//   //   .catch((err) => next(err));
//   TeacherModel.findOne({ _id: req.decodedToken.id }, { image: 1 })
//     .then((teacher) => {
//       fs.readFile("./" + teacher.image, (err, image) => {
//         if (err) { next(err) }
//         res.status(200).json(image);
//       });
//     })

//     .catch((err) => next(err));
// };
