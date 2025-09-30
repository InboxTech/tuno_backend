const About = require("../models/About");

// GET all About entries (admin)
const getAllAbout = async (req, res) => {
  try {
    const abouts = await About.find().sort({ createdAt: -1 });
    res.status(200).json(abouts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET About for frontend/public
const getFrontendAbout = async (req, res) => {
  try {
    const about = await About.findOne().sort({ createdAt: -1 });
    res.status(200).json(about);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE About entry
const createAbout = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      yearsOfExperience,
      missionText,
      missionPoints,
      visionText,
      visionPoints,
      featuresText,
      featuresPoints,
    } = req.body;

    const newAbout = new About({
      title,
      subtitle,
      description,
      yearsOfExperience,
      // Tabs
      mission: {
        text: missionText,
        points: missionPoints ? JSON.parse(missionPoints) : [],
      },
      vision: {
        text: visionText,
        points: visionPoints ? JSON.parse(visionPoints) : [],
      },
      features: {
        text: featuresText,
        points: featuresPoints ? JSON.parse(featuresPoints) : [],
      },
      // Images
      wave1: req.files?.wave1?.[0]?.path || "",
      wave2: req.files?.wave2?.[0]?.path || "",
      wave3: req.files?.aboutThumb31Shape?.[0]?.path || "",
    });

    await newAbout.save();
    res.status(201).json(newAbout);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE About entry
const updateAbout = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      subtitle,
      description,
      yearsOfExperience,
      missionText,
      missionPoints,
      visionText,
      visionPoints,
      featuresText,
      featuresPoints,
    } = req.body;

    const updateData = {
      title,
      subtitle,
      description,
      yearsOfExperience,
      mission: {
        text: missionText,
        points: missionPoints ? JSON.parse(missionPoints) : [],
      },
      vision: {
        text: visionText,
        points: visionPoints ? JSON.parse(visionPoints) : [],
      },
      features: {
        text: featuresText,
        points: featuresPoints ? JSON.parse(featuresPoints) : [],
      },
    };

    // Only update images if uploaded
    const imageFields = [
      "wave1",
      "wave2",
      "wave3",
    ];

    imageFields.forEach((field) => {
      if (req.files?.[field]?.[0]?.path) {
        updateData[field] = req.files[field][0].path;
      }
    });

    const updatedAbout = await About.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(updatedAbout);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE About entry
const deleteAbout = async (req, res) => {
  try {
    const { id } = req.params;
    await About.findByIdAndDelete(id);
    res.status(200).json({ message: "About entry deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllAbout,
  getFrontendAbout,
  createAbout,
  updateAbout,
  deleteAbout,
};
