const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // e.g., "About Us"
    subtitle: { type: String }, // e.g., tagline
    description: { type: String }, // main paragraph
    yearsOfExperience: { type: Number, default: 0 },

    // Images (store file path or URL)
    wave1: { type: String },
    wave2: { type: String },
    wave3: { type: String },


    // Tab contents
    mission: {
      text: String,
      points: [String],
    },
    vision: {
      text: String,
      points: [String],
    },
    features: {
      text: String,
      points: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("About", aboutSchema);
