const mongoose = require("mongoose");
const AdminModel = mongoose.model("admin");
const idIndicatorModel = mongoose.model("idIndicator");
const bcrypt = require("bcrypt");
const saltRounds = 12;

exports.getAllAdmins = (req, res, next) => {
  AdminModel.find({}, { email: 1 })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => next(err));
};

exports.getAdminById = (req, res, next) => {
  AdminModel.findOne({ _id: req.params.id }, { email: 1 })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => next(err));
};

exports.addNewAdmin = (req, res, next) => {
  let newAdmin = new AdminModel({
    email: req.body.email,
  });
  idIndicatorModel
    .findOne({})
    .then((idIndicator) => {
      newAdmin._id = idIndicator.adminId;
      return bcrypt.hash(req.body.password, saltRounds);
    })
    .then((hash) => {
      newAdmin.password = hash;
      return newAdmin.save();
    })
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => next(err));
};

exports.updateAdmin = (req, res, next) => {
  let updatedAdmin = {
    email: req.body.email,
  };
  bcrypt
    .hash(req.body.password, saltRounds)
    .then((hash) => {
      updatedAdmin.password = hash;
      return AdminModel.updateOne({ _id: req.body.id }, { $set: updatedAdmin });
    })
    .then((data) => {
      if (data.matchedCount) {
        res.status(201).json(data);
      } else {
        throw new Error("No Admin with this id!!");
      }
    })
    .catch((err) => next(err));
};

exports.deleteAdmin = (req, res, next) => {
  AdminModel.deleteOne({ _id: req.body.id })
    .then((data) => {
      if (data.deletedCount === 1) {
        res.status(201).json(data);
      } else {
        throw new Error("This Admin does not exist.");
      }
    })
    .catch((err) => next(err));
};
