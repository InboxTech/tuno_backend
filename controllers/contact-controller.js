const Contact = require("../models/contact-model");
const nodemailer = require("nodemailer");
// submit form 
const contactForm = async (req, res) => {
  try {
    const contactData = req.body;
    console.log("📥 Received contact data:", contactData); // Log input

    // Basic validation
    if (
      !contactData.name ||
      !contactData.email ||
      !contactData.phone ||
      !contactData.subject ||
      !contactData.message
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const saved = await Contact.create(contactData);
    console.log(" Contact saved:", saved); // Confirm save

    return res.status(200).json({ message: "Contact saved successfully" });
  } catch (error) {
    console.error("❌ Error saving contact form:", error.message);
    return res.status(500).json({
      message: "Message not delivered",
      error: error.message, // <-- add this
    });
  }
};

// get all contact
const getAllContact = async (req, res) => {
  try {
    const contactUser = await Contact.find({ deleted: { $ne: true } }).sort({
      createdAt: -1,
    });
    if (!contactUser || contactUser.length === 0) {
      return res.status(404).json({ msg: "No contact found" });
    }
    return res.status(200).json(contactUser);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return res.status(500).json({ msg: "Failed to fetch contacts" });
  }
};

// get contact bt id
const getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Contact.findOne({ _id: id }, { deleted: true }).sort({
      createdAt: -1,
    });

    if (!data) {
      return res.status(404).json({ message: "Contact not found!" });
    }
    console.log(data);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch contact" });
  }
};

// update contact status
const updateContact = async (req, res) => { };

//delete contact
const deleteContactById = async (req, res, next) => {
  try {
    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      { deleted: true },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ success: false, message: "Not found" });

    res
      .status(200)
      .json({ success: true, message: "Soft deleted", contact: updated });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Soft delete failed",
      error: error.message,
    });
  }
};

// delete multi contact ==>
const deleteMultipleContact = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No contact IDs provided" });
    }

    const result = await Contact.updateMany(
      { _id: { $in: ids } },
      { $set: { deleted: true } }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} contact  deleted`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Bulk  delete failed",
      error: error.message,
    });
  }
};
module.exports = {
  contactForm,
  getAllContact,
  getContactById,
  deleteContactById,
  deleteMultipleContact,
};


//send contact info to email
const sendContactEmail = async (req, res) => {
  const { name, email, phone, subject, company, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Name, email, and message are required." });
  }

  try {
    console.log("📨 Preparing to send email...");
    console.log("🔐 Using email:", process.env.EMAIL_USER);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: "aadil@inbox-infotech.com",
      subject: `New Contact: ${subject || "General Inquiry"}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Company:</strong> ${company || "N/A"}</p>
        <p><strong>Subject:</strong> ${subject || "N/A"}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(" Email sent:", info.response); // 👈 see what happens

    res.status(200).json({ message: "Your message has been sent to the admin." });
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    return res.status(500).json({ message: "Failed to send message. Try again later." });
  }
};

module.exports = { contactForm, getAllContact, deleteContactById, deleteMultipleContact, sendContactEmail };
