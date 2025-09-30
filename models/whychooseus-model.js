const {Schema, model} = require('mongoose');

const whyChooseUsSchema = new Schema({
    title: {type: String, required: true, trim: true},
    description: {type: String, required: true, trim: true},
    process1Title: {type: String, required: true, trim: true},
    process1Description: {type: String, required: true, trim: true},
    process2Title: {type: String, required: true, trim: true},
    process2Description: {type: String, required: true, trim: true},
    process3Title: {type: String, required: true, trim: true},
    process3Description: {type: String, required: true, trim: true},
    process4Title: {type: String, required: true, trim: true},
    process4Description: {type: String, required: true, trim: true},
    image1: {type: String, required: true},
    image2: {type: String, required: true},
    status: {type: String, enum: ['Active', 'Inactive', 'Pending'], default: 'Active'},
    isDeleted: { type: Boolean, default: false },
},
 { timestamps: true },
);

const WhyChooseUs = model('WhyChooseUs', whyChooseUsSchema);
module.exports = WhyChooseUs;