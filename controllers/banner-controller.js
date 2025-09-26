const Banner = require('../models/banner-model');
// const mongoose = require('mongoose');

const addBanner = async (req, res) => {
try {
    console.log("REQ.BODY:", req.body);
    console.log("REQ.FILES:", req.files); //  Never use string concatenation here

    const {title1,title2,description,youtubelink,status} = req.body;

    const image =
      req.files && req.files.image && req.files.image[0]
        ? `/uploads/banner/${req.files.image[0].filename}`
        : null;

const banner = new Banner({title1,title2,description,image,youtubelink,status});

    await banner.save();

    res
      .status(201)
      .json({ message: "banner added successfully", banner: banner });
} catch (error) {
    
}
}

/// get banner data admin
const getBanner = async (req, res, next) => {
    try {
         const banner = await Banner.find({ isDeleted: false }).sort({
      createdAt: -1,
    });

    // Log the services to check if the data is being fetched properly
    console.log("Banner from DB:", banner);

    if (!banner || banner.length === 0) {
      // If no banner are found, return 404
      return res.status(404).json({ message: "No banner found" });
    }

    // If services are found, return them with a 200 response
    return res.status(200).json(banner);
    } catch (error) {
        console.error("Error fetching banner:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
    }
}

//get services for frontend which only shows the active status
const getBannerFrontend = async (req, res) => {
  try {
    const banner = await Banner.find({ status: "Active", isDeleted: false }).sort({ createdAt: -1 });
    if (!banner || banner.length === 0) return res.status(404).json({ message: "No banner found" });
    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//get banner by id 
const getBannerById = async (req, res) => {
  try {
    const bannerId = req.params.id;
    const banner = await Service.findById(bannerId);
    const banners = await Service.find({ isDeleted: false });

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    return res.status(200).json(banner);
  } catch (error) {
    console.error("Error fetching banner by ID:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};


//delete banner data
const deleteBanner = async (req, res,next) => {
  try {
     const id = req.params.id;
    await Banner.findByIdAndUpdate(
      { _id: id },
      { isDeleted: true }, // mark as deleted
      { new: true }
    );
    return res.status(200).json({ message: "Banner deleted successfully" });
  } catch (error) {
    next(error);
    
  }
}

//delete selected banners
const deleteSelectedBanners = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No banner IDs provided" });
    }

    const objectIds = ids
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    const result = await Banner.updateMany(
      { _id: { $in: objectIds } },
      { $set: { isDeleted: { type: Boolean, default: false } } }
    );

    return res.status(200).json({
      message: `${result.modifiedCount} banner(s) deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting selected banners:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

//update banner data
const updateBanner = async (req, res) => {
  try {
     const bannerId = req.params.id;
    const updateData = req.body;

    if (req.files && req.files.image && req.files.image[0]) {
      updateData.image = `/uploads/banner/${req.files.image[0].filename}`;
      console.log("Uploaded files:", req.files);
    }

    const updatedBanner = await Banner.findByIdAndUpdate(bannerId,updateData,
      {
        new: true, // Return the updated document
      }
    );

    if (!updatedBanner) {
      return res.status(404).json({ msg: "Banner not found" });
    }

    res
      .status(200)
      .json({ msg: "Banner updated successfully", banner: updatedBanner });
  } catch (error) {
     console.error("updateBanner error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
}


module.exports = {addBanner,getBanner,deleteBanner,updateBanner,getBannerFrontend,getBannerById,deleteSelectedBanners};

