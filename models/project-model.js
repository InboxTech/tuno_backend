const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    fullDescription: {
      type: String,
      required: true,
      trim: true,
    },
    projectImage: {
      type: String,
      required: true,
    },

    // projectImages: {
    //   type: [String],
    //   default: [],
    // },
    deleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Pending"],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
