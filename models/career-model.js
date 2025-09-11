const { Schema, model } = require('mongoose');

const careerschema = new Schema({
    designation: {
        type: String,
        required: true
    },
    skills: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    short_description: {
        type: String,
        required: true
    },
    full_description: {
        type: String,
        required: true
    },
    openings: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    jobtype: {
        type: String,
        required: true
    },
    joinin: {
        type: String,
        required: true
    },
    last_date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Pending'],
        default: 'Pending'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false,
    } 
    },
{ timestamps: true }
)

const Career = new model('Career', careerschema);
module.exports = Career;

