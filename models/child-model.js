const mongoose = require("mongoose");

const adressSchema = new mongoose.Schema(
  {
    city: { type: String, required: true },
    street: { type: String, required: true },
    building: { type: String, required: true },
  },
  { _id: false }
);

const schema = new mongoose.Schema(
  {
    _id: Number,
    fullName: { type: String, required: true },
    birthDate: { type: String, required: true },
    level: { type: String, required: true },
    address: adressSchema,
  },
  { timestamps: true }
);

mongoose.model("child", schema);
