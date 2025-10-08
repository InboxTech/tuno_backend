const mongoose = require("mongoose");

const LinkedInPostSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  postUrl: {
    type: String,
    required: true,
  },
  altText: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("LinkedInPost", LinkedInPostSchema);
