const { Schema, model } = require("mongoose");

const industrySchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  short_description: {
    type: String,
    required: true,
    trim: true
  },
  full_description: {
    type: String,
    required: true
  },
  industry_image: {
    type: String, // URL
    required: true
  },
  thumbnail_image: {
    type: String, // URL
    required: true
  },
  image_alt_text: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Pending'],
    default: 'Pending'
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date
  },
   isDeleted: {
    type: Boolean,
    default: false,
  } 
});

const Industry = new model("Industry", industrySchema);

module.exports = Industry;