const Service = require("../models/service-model");
const mongoose = require("mongoose");
// const { ObjectId } = require("mongodb");

//add services
const addServices = async (req, res) => {
  try {
    console.log("REQ.BODY:", req.body);
    console.log("REQ.FILES:", req.files); // ✅ Never use string concatenation here

    const {
      title,
      short_description,
      full_description,
      image_alt_text,
      status,
    } = req.body;

    const service_image =
      req.files && req.files.service_image && req.files.service_image[0]
        ? `/uploads/services/${req.files.service_image[0].filename}`
        : null;

    // const service_images = req.files && req.files.service_images
    //   ? req.files.service_images.map(file => `/uploads/serviceimage/${file.filename}`)
    //   : [];

    const service = new Service({
      title,
      short_description,
      full_description,
      image_alt_text,
      status,
      service_image,
      // service_images,
    });

    await service.save();

    res
      .status(201)
      .json({ message: "Service added successfully", service: service });
  } catch (error) {
    console.error("Error in addService:", error); // 🔥 This log is very important
    res.status(500).json({ message: "Internal server error" });
  }
};

//get services for frontend which only shows the active status
const getServices = async (req, res, next) => {
  try {
    const services = await Service.find({
      status: "Active",
      isDeleted: false,
    }).sort({ createdAt: -1 });

    // Log the services to check if the data is being fetched properly
    console.log("Services from DB:", services);

    if (!services || services.length === 0) {
      // If no services are found, return 404
      return res.status(404).json({ message: "No services found" });
    }

    // If services are found, return them with a 200 response
    return res.status(200).json(services);
  } catch (error) {
    // Log the error and send a 500 response in case of an exception
    console.error("Error fetching services:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

//get services for admin which shows all status
const getServicesAdmin = async (req, res, next) => {
  try {
    const services = await Service.find({ isDeleted: false }).sort({
      createdAt: -1,
    });

    // Log the services to check if the data is being fetched properly
    console.log("Services from DB:", services);

    if (!services || services.length === 0) {
      // If no services are found, return 404
      return res.status(404).json({ message: "No services found" });
    }

    // If services are found, return them with a 200 response
    return res.status(200).json(services);
  } catch (error) {
    // Log the error and send a 500 response in case of an exception
    console.error("Error fetching services:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get single service by ID
const getServiceById = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const service = await Service.findById(serviceId);
    const services = await Service.find({ isDeleted: false });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    return res.status(200).json(service);
  } catch (error) {
    console.error("Error fetching service by ID:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// update service
const updateServices = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const updateData = req.body;

    //  // Handle new uploaded single image
    //   if (req.file) {
    //     updateData.service_image = `/uploads/serviceimage/${req.file.filename}`;
    //   }

    //   // Handle new uploaded multiple images
    //   if (req.files && req.files.length > 0) {
    //     updateData.service_images = req.files.map(file => `/uploads/serviceimage/${file.filename}`);
    //   }

    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      updateData,
      {
        new: true, // Return the updated document
      }
    );

    if (!updatedService) {
      return res.status(404).json({ msg: "Service not found" });
    }

    res
      .status(200)
      .json({ msg: "Service updated successfully", service: updatedService });
  } catch (error) {
    console.error("updateService error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

//delete services
const deleteServices = async (req, res) => {
  try {
    const id = req.params.id;
    await Service.findByIdAndUpdate(
      { _id: id },
      { isDeleted: true }, // mark as deleted
      { new: true }
    );
    return res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    next(error);
  }
};

//delete selected services
const deleteSelectedServices = async (req, res) => {
  try {
    const { ids } = req.body;
    // console.log("BODY:", req.body);

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No service IDs provided" });
    }

    // ✅ Convert using `createFromHexString` (recommended for Mongoose v8+)
    const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

    const objectIds = ids
      .filter(isValidObjectId)
      .map((id) => mongoose.Types.ObjectId.createFromHexString(id));
    const result = await Service.updateMany(
      { _id: { $in: objectIds } },
      { $set: { isDeleted: true } }
    );

    return res.status(200).json({
      message: `${result.deletedCount} service(s) deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting selected services:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  addServices,
  getServices,
  updateServices,
  deleteServices,
  getServiceById,
  deleteSelectedServices,
  getServicesAdmin,
};
