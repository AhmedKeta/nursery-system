/* eslint-disable no-undef */
const mongoose = require("mongoose");
const ChildModel = mongoose.model("child");
const TeacherModel = mongoose.model("teacher");
const ClassModel = mongoose.model("class");
const idIndicatorModel = mongoose.model("idIndicator");

exports.getAllClasses = (req, res, next) => {
  ClassModel.find()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => next(err));
};

exports.getClassById = (req, res, next) => {
  ClassModel.findOne({ _id: req.params.id })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => next(err));
};

exports.addNewClass = (req, res, next) => {
  TeacherModel.findOne({ _id: req.body.supervisor })
    .then((teacher) => {
      if (!teacher) {
        throw new Error("teacher does not exist!!");
      } else {
        return ChildModel.find({ _id: { $in: req.body.children } });
      }
    })
    .then((children) => {
      if (children.length !== req.body.children.length) {
        throw new Error("Some children does not exist!!");
      }
      newClass = new ClassModel({
        name: req.body.name,
        supervisor: req.body.supervisor,
        children: req.body.children,
      });
      return idIndicatorModel.findOne({});
    })
    .then((idIndicator) => {
      newClass._id = idIndicator.classId;
      return newClass.save();
    })
    .then(() => {
      // let conditions = { _id: 1 };
      let update = { $inc: { classId: 1 } };
      return idIndicatorModel.updateOne({}, update);
    })
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => next(err));
};

exports.updateClass = (req, res, next) => {
  let updatedChild = {
    name: req.body.name,
    supervisor: req.body.supervisor,
    children: req.body.children,
  };
  ClassModel.updateOne({ _id: req.body.id }, { $set: updatedChild })
    .then((data) => {
      if (data.matchedCount) {
        res.status(201).json(data);
      } else {
        throw new Error("No class with this id!!");
      }
    })
    .catch((err) => next(err));
};

exports.deleteClass = (req, res, next) => {
  ClassModel.deleteOne({ _id: req.body.id })
    .then((data) => {
      if (data.deletedCount === 1) {
        res.status(201).json(data);
      } else {
        throw new Error("This class does not exist.");
      }
    })
    .catch((err) => next(err));
};

exports.getClassChildrenInfo = (req, res, next) => {
  ClassModel.findOne({ _id: req.params.id })
    .then((data) => {
      return ChildModel.find({ _id: { $in: data.children } });
    })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => next(err));
};

exports.getClassSupervisorInfo = (req, res, next) => {
  ClassModel.findOne({ _id: req.params.id })
    .then((data) => {
      return TeacherModel.findOne(
        { _id: data.supervisor },
        { fullName: 1, email: 1, image: 1 }
      );
    })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => next(err));
};
