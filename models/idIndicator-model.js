const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    childId: Number,
    classId: Number,
  },
  { timestamps: true }
);

mongoose.model("idIndicator", schema);
