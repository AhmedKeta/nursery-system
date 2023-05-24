const mongoose = require("mongoose");
const ChildModel = mongoose.model("child");
const ClassModel = mongoose.model("class");
const idIndicatorModel = mongoose.model("idIndicator");

exports.getAllChildren = (req, res, next) => {
  ChildModel.find()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => next(err));
};

exports.getChildById = (req, res, next) => {
  ChildModel.findOne({ _id: req.params.id })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => next(err));
};

exports.getChildClassInfo = (req, res, next) => {
  ClassModel.findOne({ children: req.params.id })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => next(err));
};

exports.addNewChild = (req, res, next) => {
  let newChild = new ChildModel({
    fullName: req.body.fullName,
    birthDate: req.body.birthDate,
    level: req.body.level,
    address: req.body.address,
  });
  idIndicatorModel
  .findOne({})
  .then((idIndicator) => {
    newChild._id = idIndicator.childId;
    return newChild.save();
  })
  .then(() => {
      // let conditions = { _id: 1 };
      let update = { $inc: { childId: 1 } };
      return idIndicatorModel.updateOne({}, update);
    })
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => next(err));
};

exports.updateChild = (req, res, next) => {
  let updatedChild = {
    fullName: req.body.fullName,
    birthDate: req.body.birthDate,
    level: req.body.level,
    address: req.body.address,
  };
  ChildModel.updateOne({ _id: req.body.id }, { $set: updatedChild })
    .then((data) => {
      if (data.matchedCount) {
        res.status(201).json(data);
      } else {
        throw new Error("No child with this id!!");
      }
    })
    .catch((err) => next(err));
};

exports.deleteChild = (req, res, next) => {
  ClassModel.updateOne(
    { children: req.body.id },
    { $pull: { children: req.body.id } }
  )
    .then(() => {
      return ChildModel.deleteOne({ _id: req.body.id });
    })
    .then((data) => {
      if (data.deletedCount === 1) {
        res.status(201).json(data);
      } else {
        throw new Error("This child does not exist.");
      }
    })
    .catch((err) => next(err));
};
