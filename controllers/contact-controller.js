const Contact = require("../models/contact-model");

// submit form 
const contactForm = async (req, res) => {
  try {
    const contactData = req.body;

    if (
      !contactData.name ||
      !contactData.email ||
      !contactData.phone ||
      !contactData.subject ||
      !contactData.company ||
      !contactData.message
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await Contact.create(contactData);
    return res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error saving contact form:", error);
    return res.status(500).json({ message: "Message not delivered" });
  }
};

// get all contact
const getAllContact = async (req, res) => {
  try {
    const contactUser = await Contact.find({ deleted: { $ne: true } }).sort({ createdAt: -1 });
    if (!contactUser || contactUser.length === 0) {
      return res.status(404).json({ msg: "No contact found" });
    }
    return res.status(200).json(contactUser);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return res.status(500).json({ msg: "Failed to fetch contacts" });
  }
};

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
module.exports = { contactForm, getAllContact, deleteContactById,deleteMultipleContact };
