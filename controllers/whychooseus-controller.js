const WhyChooseUs = require('../models/whychooseus-model');
const mongoose = require("mongoose");

// add why choose us
const addWhyChooseUs = async (req, res) => { 
    try {
         console.log("REQ.BODY:", req.body);
    console.log("REQ.FILES:", req.files); //  Never use string concatenation here

    const {title,description,process1Title,process1Description,process2Title,process2Description,
        process3Title,process3Description,process4Title,process4Description,status} = req.body;
      

    const image1 = req.files && req.files.image1 && req.files.image1[0]
        ? `/uploads/whychooseus/${req.files.image1[0].filename}`
        : null;

       const image2 = req.files && req.files.image2 && req.files.image2[0]
        ? `/uploads/whychooseus/${req.files.image2[0].filename}`
        : null;

    const whychooseus = new WhyChooseUs({
      title,description,process1Title,process1Description,process2Title,process2Description,process3Title,process3Description,process4Title,process4Description,status,image1,image2
    });

    await whychooseus.save();

    res
      .status(201)
      .json({ message: "Content added successfully", whychooseus: whychooseus });
    } catch (error) {
         console.error("Error in addWhyChooseUs:", error); // 🔥 This log is very important
    res.status(500).json({ message: "Internal server error" });
    }
}


//get whychooseus for frontend which only shows the active status
const getWhyChooseUsFrontend = async (req, res) => {    
    try {
          const whychooseus = await WhyChooseUs.find({
      status: "Active",
      isDeleted: false,
    }).sort({ createdAt: -1 });

    // Log the whychooseus to check if the data is being fetched properly
    console.log("why choose us from DB:", whychooseus);

    if (!whychooseus || whychooseus.length === 0) {
      // If no contents are found, return 404
      return res.status(404).json({ message: "No content found" });
    }

    // If contents are found, return them with a 200 response
    return res.status(200).json(whychooseus);
    } catch (error) {
         // Log the error and send a 500 response in case of an exception
    console.error("Error fetching contents:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
    }
}


//get whychooseus for admin which shows all status
const getWhychooseUs = async (req, res, next) => {
  try {
    const whychooseus = await WhyChooseUs.find({ isDeleted: false }).sort({
      createdAt: -1,
    });

    // Log the services to check if the data is being fetched properly
    console.log("content from DB:", whychooseus);

    if (!whychooseus || whychooseus.length === 0) {
      // If no content are found, return 404
      return res.status(404).json({ message: "No content found" });
    }

    // If services are found, return them with a 200 response
    return res.status(200).json(whychooseus);
  } catch (error) {
    // Log the error and send a 500 response in case of an exception
    console.error("Error fetching content:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};


// Get single process by ID
const getProcessById = async (req, res) => {
  try {
    const processId = req.params.id;
    const process = await WhyChooseUs.findById(processId);
    const processes = await WhyChooseUs.find({ isDeleted: false });

    if (!process) {
      return res.status(404).json({ message: "content not found" });
    }

    return res.status(200).json(process);
  } catch (error) {
    console.error("Error fetching process by ID:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};


//delete whychooseus data
const deleteWhyChooseUs = async (req, res,next) => {
    try {
         const id = req.params.id;
    await WhyChooseUs.findByIdAndUpdate(
      { _id: id },
      { isDeleted: true }, // mark as deleted
      { new: true }
    );
    return res.status(200).json({ message: "Why choose us deleted successfully" });
    } catch (error) {
         next(error);
          res.status(500).json({ message: "Failed to delete", error: err.message });
    }
} 

//delete selected why choose us
const deleteSelectedWhyChooseUs = async (req, res) => {
  try {
    const { ids } = req.body;
    // console.log("BODY:", req.body);

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No whychooseus IDs provided" });
    }

    // ✅ Convert using `createFromHexString` (recommended for Mongoose v8+)
    const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

    const objectIds = ids
      .filter(isValidObjectId)
      .map((id) => mongoose.Types.ObjectId.createFromHexString(id));
    const result = await WhyChooseUs.updateMany(
      { _id: { $in: objectIds } },
      { $set: { isDeleted: true } }
    );

    return res.status(200).json({
      message: `${result.deletedCount} whychooseus(s) deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting selected whychoose:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

//update banner data
const updateWhyChooseUs = async (req, res) => {
  try {
     const whychooseusId = req.params.id;
    const updateData = req.body;

    if (req.files && req.files.image1 && req.files.image1[0]) {
      updateData.image1 = `/uploads/whychooseus/${req.files.image1[0].filename}`;
      console.log("Uploaded files:", req.files);
    }

    if (req.files && req.files.image2 && req.files.image2[0]) {
      updateData.image2 = `/uploads/whychooseus/${req.files.image2[0].filename}`;
      console.log("Uploaded files:", req.files);
    }
    const updatedWhyChooseUs = await WhyChooseUs.findByIdAndUpdate(whychooseusId,updateData,
      {
        new: true, // Return the updated document
      }
    );

    if (!updatedWhyChooseUs) {
      return res.status(404).json({ msg: "Banner not found" });
    }

    res
      .status(200)
      .json({ msg: "content updated successfully", whychooseus: updatedWhyChooseUs });
  } catch (error) {
     console.error("updatedWhyChooseUs error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
}

module.exports = {addWhyChooseUs,getWhyChooseUsFrontend,getWhychooseUs,getProcessById,deleteWhyChooseUs,deleteSelectedWhyChooseUs,updateWhyChooseUs};