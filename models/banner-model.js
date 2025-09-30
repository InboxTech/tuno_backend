const {Schema, model} = require('mongoose');

const bannerSchema = new Schema({
  title1: {type: String, required: true, trim: true},
  title2: {type: String, required: true, trim: true},
  description: {type: String, required: true, trim: true},
  image: {type: String, required: true},
  youtubelink: {type: String, required: true},
  status: {type: String, enum: ['Active', 'Inactive', 'Pending'], default: 'Active'},
  isDeleted: {type: Boolean, default: false},
},
 { timestamps: true }
)

const banner = model('Banner', bannerSchema);

module.exports = banner;