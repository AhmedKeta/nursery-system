const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

mongoose.model("admin", schema);
