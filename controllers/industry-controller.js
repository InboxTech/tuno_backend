const Industry = require("../models/industry-model")
const mongoose = require("mongoose");

// add industry
const addIndustry = async(req,res) => {
    try {
         console.log("REQ.BODY:", req.body);
    console.log("REQ.FILES:", req.files); // ✅ Never use string concatenation here

    const { title, short_description, full_description, image_alt_text, status } = req.body;

    const industry_image = req.files && req.files.industry_image && req.files.industry_image[0]
      ? `/uploads/industries/${req.files.industry_image[0].filename}`
      : null;

    const industry = new Industry({
      title,
      short_description,
      full_description,
      image_alt_text,
      status,
      industry_image,
      
    });

    await industry.save();

    res.status(201).json({ message: "Industry added successfully", industry: industry });

    } catch (error) {
       console.error("Add Industry Error:", error);
      return res.status(500).json({ message: "Server Error", error: error.message });

    }
}

// get all instries with all status
const getIndustries = async (req, res) => {
    try {
         const industries = await Industry.find({isDeleted: false}).sort({ createdAt: -1 });

    // Log the services to check if the data is being fetched properly
    console.log("Industries from DB:", industries);

    if (!industries || industries.length === 0) {
      // If no services are found, return 404
      return res.status(404).json({ message: "No industries found" });
    }

    // If services are found, return them with a 200 response
    return res.status(200).json(industries);
   
  } catch (error) {
        console.log("Error in fetching industries:", error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
}

//get all industry with active status in frontend
const getIndustriesActive = async (req, res) => {
    try {
         const industries = await Industry.find({status: 'Active',isDeleted: false}).sort({ createdAt: -1 });

    // Log the services to check if the data is being fetched properly
    console.log("Industries from DB:", industries);

    if (!industries || industries.length === 0) {
      // If no services are found, return 404
      return res.status(404).json({ message: "No industries found" });
    }

    // If services are found, return them with a 200 response
    return res.status(200).json(industries);
   
  } catch (error) {
        console.log("Error in fetching industries:", error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
}

// Get single industry by ID
const getIndustryById = async (req, res) => {
  try {
    const industryId = req.params.id;
    const industry = await Industry.findById(industryId);
    const industries = await Industry.find({ isDeleted: false });

    if (!industry) {
      return res.status(404).json({ message: "Industry not found" });
    }

    return res.status(200).json(industry);
  } catch (error) {
    console.error("Error fetching industry by ID:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

//update industry
const updateIndustries = async (req, res) => {
  try {
    const industryId = req.params.id;
    const updateData = {...req.body};

  if( req.files && req.files.industry_image && req.files.industry_image[0]){
    updateData.industry_image = `/uploads/industries/${req.files.industry_image[0].filename}`;
    console.log("Uploaded files:", req.files);
  }

    const updatedIndustry = await Industry.findByIdAndUpdate(industryId, updateData, {
      new: true, // Return the updated document
    });

    if (!updatedIndustry) {
      return res.status(404).json({ msg: "Industry not found" });
    }

    res.status(200).json({ msg: "Industry updated successfully", Industry: updatedIndustry });
  } catch (error) {
    console.error("updateIndustry error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};


//delete industry
const deleteIndustry = async (req, res) => {
     try {
        const id = req.params.id;
        await Industry.findByIdAndUpdate({_id: id},
          { isDeleted: true }, // mark as deleted
          { new: true }
        )
        return res.status(200).json({message: "Industry deleted successfully"})
    } catch (error) {
        next(error)
    }
}


//delete selected industries
//delete selected services 
const deleteSelectedIndustries = async (req, res) => {
  try {
    const { ids } = req.body;
    console.log("BODY:", req.body);

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No industry IDs provided" });
    }

    // ✅ Convert using `createFromHexString` (recommended for Mongoose v8+)
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const objectIds = ids
  .filter(isValidObjectId)
  .map((id) => mongoose.Types.ObjectId.createFromHexString(id));
    const result = await Industry.updateMany({ _id: { $in: objectIds } },{ $set: { isDeleted: true } } );

    return res.status(200).json({
      message: `${result.modifiedCount} industry(s) deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting selected industries:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
module.exports = {addIndustry,getIndustries,getIndustriesActive,getIndustryById,deleteIndustry,deleteSelectedIndustries,updateIndustries};