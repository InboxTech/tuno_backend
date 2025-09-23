const mongoose = require("mongoose");

const WorkProcessSchema = new mongoose.Schema(
  {
    stepNumber: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String }, // path to uploaded image
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkProcess", WorkProcessSchema);
