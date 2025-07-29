const Project = require("../models/project-model");

//  Create project

const createProject = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);

    const { title, shortDescription, fullDescription, status } = req.body;

    //  Access files using multer.fields structure
    const singleImage = req.files?.["projectImage"]?.[0];
    const multipleImages = req.files?.["projectImages"] || [];

    const projectImage = singleImage
      ? `/uploads/projects/${singleImage.filename}`
      : null;

    const projectImages = multipleImages.map(
      (file) => `/uploads/projects/${file.filename}`
    );

    //  Basic validation
    if (
      !title ||
      !shortDescription ||
      !fullDescription ||
      !status ||
      !projectImage
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields",
      });
    }

    const newProject = new Project({
      title,
      shortDescription,
      fullDescription,
      status,
      projectImage,
      projectImages,
    });

    const savedProject = await newProject.save();

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: savedProject,
    });
  } catch (error) {
    console.error("createProject error:", error);
    res.status(500).json({
      success: false,
      message: "Create failed",
      error: error.message,
    });
  }
};

//  Get all  projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ deleted: false }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, projects });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Admin fetch failed",
        error: error.message,
      });
  }
};
// get frontend ==>
const getFrontendProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      deleted: false,
      status: "Active",
    }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, projects });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Frontend fetch failed",
        error: error.message,
      });
  }
};

//  Get single project
const getSingleProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      deleted: false,
    });
    if (!project)
      return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, project });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error", error: error.message });
  }
};

//  Update project
const updateProject = async (req, res) => {
  try {
    const { title, shortDescription, fullDescription, status } = req.body;

    const updateData = {
      title,
      shortDescription,
      fullDescription,
      status,
    };

    //  For single image
    if (req.files?.projectImage?.[0]) {
      updateData.projectImage = `/uploads/projects/${req.files.projectImage[0].filename}`;
    }

    //  For multiple images
    if (req.files?.projectImages?.length > 0) {
      updateData.projectImages = req.files.projectImages.map(
        (file) => `/uploads/projects/${file.filename}`
      );
    }
    const updated = await Project.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      updateData,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ success: false, message: "Not found" });

    res
      .status(200)
      .json({ success: true, message: "Updated", project: updated });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Update failed", error: error.message });
  }
};

//  Soft delete (single)
const softDeleteProject = async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { deleted: true },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ success: false, message: "Not found" });

    res
      .status(200)
      .json({ success: true, message: "Soft deleted", project: updated });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Soft delete failed",
      error: error.message,
    });
  }
};

//  Soft delete (bulk)
const softDeleteSelectedProjects = async (req, res) => {
  try {
    const { ids } = req.body; // Expect: { ids: ['id1', 'id2', ...] }

    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No project IDs provided" });
    }

    const result = await Project.updateMany(
      { _id: { $in: ids } },
      { $set: { deleted: true } }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} projects soft deleted`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Bulk soft delete failed",
      error: error.message,
    });
  }
};

//  Restore project
const restoreProject = async (req, res) => {
  try {
    const restored = await Project.findByIdAndUpdate(
      req.params.id,
      { deleted: false },
      { new: true }
    );

    if (!restored)
      return res.status(404).json({ success: false, message: "Not found" });

    res
      .status(200)
      .json({ success: true, message: "Restored", project: restored });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Restore failed",
      error: error.message,
    });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getSingleProject,
  updateProject,
  softDeleteProject,
  softDeleteSelectedProjects,
  restoreProject,
  getFrontendProjects,
};
