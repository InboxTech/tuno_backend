const { Schema, model } = require('mongoose');

const jobApplySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    phone: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    message: {
        type: String,
        required: true
    },
    resume: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['Pending', 'Shortlisted', 'Rejected', 'On Hold', 'Need to discuss'],
        default: 'Pending',
    }
  
})

const JobApply = new model('JobApply', jobApplySchema);
module.exports = JobApply;