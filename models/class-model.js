const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    _id: Number,
    name: String,
    supervisor: { type: String },
    children: [{ type: Number, unique: true }],
  },
  { timestamps: true }
);

mongoose.model("class", schema);

// ref: "child"; //.populate
