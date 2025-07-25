const Career = require('../models/career-model');

const addJobOpenings = async (req, res) => {
  try {
    const {
      designation,
      skills,
      short_description,
      full_description,
      openings,
      experience,
      jobtype,
      joinin,
      last_date,
      status,
      category,
    } = req.body;

    // Basic validation
    if (
      !designation ||
      !skills ||
      !short_description ||
      !full_description ||
      !openings ||
      !experience ||
      !jobtype ||
      !joinin ||
      !last_date ||
      !status ||
      !category
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newOpening = new Career({
      designation,
      skills,
      short_description,
      full_description,
      openings,
      experience,
      jobtype,
      joinin,
      last_date: new Date(last_date), // ensure it's a Date
      status,
      category,
    });

    await newOpening.save();

    res.status(201).json({
      message: "Job opening created successfully",
      job: newOpening,
    });
  } catch (error) {
    console.error("Error in addJobOpenings:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};



//get all job openings for admin
const getJobOpeningsAdmin = async (req, res) => {
  try {
    const jobOpenings = await Career.find({isDeleted: false}).sort({ createdAt: -1 });
    res.status(200).json({message: "get openings successfully",jobOpenings});
  } catch (error) {
    console.error("Error fetching job openings:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};


//get all job openings for frontend only shows active status
const getJobOpenings = async (req, res) => {
  try {
    const jobOpenings = await Career.find({ status: 'Active',isDeleted: false }).sort({ createdAt: -1 });
    res.status(200).json({message: "get openings successfully",jobOpenings});
  } catch (error) {
    console.error("Error fetching job openings:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

//get job openings by id
const getJobOpeningById = async (req, res) => {
  try {
    const id = req.params.id;
    const jobOpening = await Career.findById(id);
    const jobOpenings = await Career.find({ isDeleted: false });
    if (!jobOpening) {
      return res.status(404).json({ msg: "Job opening not found" });
    }
    res.status(200).json({ message: "Job opening fetched successfully", jobOpening });
  } catch (error) {

    console.error("Error fetching job opening:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};


// Get related job openings
const getRelatedJobsByCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const currentJob = await Career.findById(id).sort({ createdAt: -1 });
    if (!currentJob) {
      return res.status(404).json({ msg: "Job not found" });
    }

    const relatedJobs = await Career.find({
      _id: { $ne: id },
      status: "Active",
      isDeleted: false, 
      category: currentJob.category,
    }).limit(5);

    res.status(200).json({ message: "Related job openings fetched", relatedJobs });
  } catch (error) {
    console.error("Error fetching related jobs by category:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};


//delete job openings
const deleteJobOpenings = async (req, res) => {
  try {
    const id = req.params.id;

    const jobOpening = await Career.findByIdAndUpdate(
      id,
      { isDeleted: true }, // mark as deleted
      { new: true }
    );

    if (!jobOpening) {
      return res.status(404).json({ msg: "Job opening not found" });
    }

    res.status(200).json({ message: "Job opening soft deleted successfully" });
  } catch (error) {
    console.error("Error soft deleting job opening:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

//delete selected job openings
const deleteSelectedJobOpenings = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ msg: "No IDs provided" });
    }

    const result = await Career.updateMany(
      { _id: { $in: ids } },
      { $set: { isDeleted: true } } // soft delete
    );

    res.status(200).json({ message: "Selected job openings soft deleted successfully", result });
  } catch (error) {
    console.error("Error soft deleting selected job openings:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

//update job openings
const updateJobOpenings = async (req, res) => {
    try {
        const jobid = req.params.id;
        const updateData = req.body;
        const updatedJobOpening = await Career.findByIdAndUpdate(jobid, updateData, {
            new: true, // Return the updated document   
        });
        if (!updatedJobOpening) {
            return res.status(404).json({ msg: "Job opening not found" });
        }
        res.status(200).json({ message: "Job opening updated successfully", jobOpening: updatedJobOpening });

    } catch (error) {
        console.error("Error updating job opening:", error);
        return res.status(500).json({ msg: "Server error", error: error.message });
        
    }
}
module.exports = {addJobOpenings,getJobOpenings,getJobOpeningsAdmin, deleteJobOpenings,deleteSelectedJobOpenings,updateJobOpenings,getJobOpeningById,getRelatedJobsByCategory};