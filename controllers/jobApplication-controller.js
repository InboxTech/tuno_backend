const JobApply = require('../models/jobApplication-model')
const mongoose = require("mongoose");

//add application details
const addApplication = async (req, res) => {
  try {
      console.log("FILE:", req.files); // resume should be here
    console.log("BODY:", req.body);

    const { name, email, phone, position, address, message } = req.body;
    const resume = req.files?.resume?.[0]?.filename;

    if (!resume) {
      return res.status(400).json({ error: "Resume file is required" });
    }

    const newApplication = new JobApply({
      name,
      email,
      phone,
      position,
      address,
      message,
      resume,
    });

    await newApplication.save();
    res.status(201).json({ message: "Application submitted successfully" });

  } catch (error) {
    console.error("Application error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


//get all applications
const getAllApplications = async (req, res) => {
  try {
    const applications = await JobApply.find({isDeleted: false}).sort({ createdAt: -1 });

    const result = applications.map((app) => ({
      ...app._doc,
      resumeUrl: `${req.protocol}://${req.get("host")}/uploads/resumes/${app.resume}`,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

//delete single application by id 
const deleteApplication = async (req, res) => {
try {
    const id = req.params.id;
   await JobApply.findByIdAndUpdate(id,
    { isDeleted: true }, // mark as deleted
      { new: true });
        res.status(200).json({message: "Application deleted successfully"});
} catch (error) {
    console.log(error)
}
}


//delete selected applications
const deleteSelectedApplications = async (req, res) => {
      try {
    const { ids } = req.body;
    console.log("BODY:", req.body);

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No Application IDs provided" });
    }

    // ✅ Convert using `createFromHexString` (recommended for Mongoose v8+)
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const objectIds = ids
  .filter(isValidObjectId)
  .map((id) => mongoose.Types.ObjectId.createFromHexString(id));
    const result = await JobApply.updateMany({ _id: { $in: objectIds } },{ $set: { isDeleted: true } } );

    return res.status(200).json({
      message: `${result.deletedCount} application(s) deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting selected applications:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}
module.exports = {addApplication,getAllApplications,deleteApplication,deleteSelectedApplications};