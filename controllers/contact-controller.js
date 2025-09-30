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
// send contact info to multiple emails (Admin + HR)
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

    // Multiple recipients here 👇
    const recipients = [
      "darshit@inboxtechs.com", // Admin
      "info@inbox-infotech.com",    // HR

    ];

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: recipients, // <-- send to multiple
      subject: `New Contact: ${subject || "General Inquiry"}`,
      html: `
        <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); overflow: hidden;">
        
        <!-- Header -->
        <div style="background: #581c87; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                📧 New Contact Message
            </h1>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
            
            <!-- Contact Information Grid -->
            <div style="display: table; width: 100%; margin-bottom: 30px;">
                
                <!-- Name Field -->
                <div style="display: table-row;">
                    <div style="display: table-cell; padding: 15px 20px 15px 0; vertical-align: top; width: 120px;">
                        <div style="background-color: #667eea; color: #ffffff; padding: 8px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block;">
                            👤 Name
                        </div>
                    </div>
                    <div style="display: table-cell; padding: 15px 0; vertical-align: top;">
                        <div style="font-size: 16px; font-weight: 600; color: #2d3748; background-color: #f7fafc; padding: 12px 16px; border-radius: 8px; border-left: 4px solid #667eea;">
                            ${name}
                        </div>
                    </div>
                </div>

                <!-- Email Field -->
                <div style="display: table-row;">
                    <div style="display: table-cell; padding: 15px 20px 15px 0; vertical-align: top; width: 120px;">
                        <div style="background-color: #48bb78; color: #ffffff; padding: 8px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block;">
                            ✉️ Email
                        </div>
                    </div>
                    <div style="display: table-cell; padding: 15px 0; vertical-align: top;">
                        <div style="font-size: 16px; color: #2d3748; background-color: #f0fff4; padding: 12px 16px; border-radius: 8px; border-left: 4px solid #48bb78;">
                            <a href="mailto:${email}" style="color: #48bb78; text-decoration: none; font-weight: 500;">${email}</a>
                        </div>
                    </div>
                </div>

                <!-- Phone Field -->
                <div style="display: table-row;">
                    <div style="display: table-cell; padding: 15px 20px 15px 0; vertical-align: top; width: 120px;">
                        <div style="background-color: #ed8936; color: #ffffff; padding: 8px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block;">
                            📞 Phone
                        </div>
                    </div>
                    <div style="display: table-cell; padding: 15px 0; vertical-align: top;">
                        <div style="font-size: 16px; color: #2d3748; background-color: #fffaf0; padding: 12px 16px; border-radius: 8px; border-left: 4px solid #ed8936;">
                            ${phone || "N/A"}
                        </div>
                    </div>
                </div>

                <!-- Company Field -->
                <div style="display: table-row;">
                    <div style="display: table-cell; padding: 15px 20px 15px 0; vertical-align: top; width: 120px;">
                        <div style="background-color: #9f7aea; color: #ffffff; padding: 8px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block;">
                            🏢 Company
                        </div>
                    </div>
                    <div style="display: table-cell; padding: 15px 0; vertical-align: top;">
                        <div style="font-size: 16px; color: #2d3748; background-color: #faf5ff; padding: 12px 16px; border-radius: 8px; border-left: 4px solid #9f7aea;">
                            ${company || "N/A"}
                        </div>
                    </div>
                </div>

                <!-- Subject Field -->
                <div style="display: table-row;">
                    <div style="display: table-cell; padding: 15px 20px 15px 0; vertical-align: top; width: 120px;">
                        <div style="background-color: #38b2ac; color: #ffffff; padding: 8px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block;">
                            📋 Subject
                        </div>
                    </div>
                    <div style="display: table-cell; padding: 15px 0; vertical-align: top;">
                        <div style="font-size: 16px; color: #2d3748; background-color: #e6fffa; padding: 12px 16px; border-radius: 8px; border-left: 4px solid #38b2ac;">
                            ${subject || "N/A"}
                        </div>
                    </div>
                </div>
            </div>

   

        <!-- Footer -->
        <div style="background-color: #f7fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #718096; font-size: 14px;">
                📅 Received on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
            </p>
            <p style="margin: 5px 0 0 0; color: #a0aec0; font-size: 12px;">
                This is an automatically generated contact form submission.
            </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);

    res.status(200).json({ message: "Your message has been sent to Admin and HR." });
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    return res.status(500).json({ message: "Failed to send message. Try again later." });
  }
};

module.exports = { contactForm, getAllContact, deleteContactById, deleteMultipleContact, sendContactEmail };
