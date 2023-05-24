const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    active: { type: Boolean, required: true },
    activateToken: String,
    activateTokenExp: Date,
  },
  { timestamps: true }
);

mongoose.model("teacher", schema);
