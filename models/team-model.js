const { Schema, model } = require("mongoose");

const teamSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    experience: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    facebook: { type: String, trim: true },
    twitter: { type: String, trim: true },
    linkedIn: { type: String, required: true, trim: true },
    instagram: { type: String, trim: true },
    description: { type: String, required: true, trim: true },
    deleted: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Pending"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Model creation
const Team = model("Team", teamSchema);

module.exports = Team;
