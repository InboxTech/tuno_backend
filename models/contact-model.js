const { Schema, model } = require("mongoose");

const contactSchema = new Schema({
  name: { type: String, required: true }, // was username
  email: { type: String, required: true },
  phone: { type: String, required: true },
  subject: { type: String, required: true },
  company: { type: String, required: true },
  message: { type: String, required: true },
   deleted: {
      type: Boolean,
      default: true,
    },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  
});

// Create model
const Contact = model("Contact", contactSchema);

module.exports = Contact;
