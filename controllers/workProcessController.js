const WorkProcess = require("../models/WorkProcess");

// GET all steps
const getWorkProcesses = async (req, res) => {
  try {
    const steps = await WorkProcess.find().sort({ stepNumber: 1 });
    res.status(200).json(steps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE new step
const createWorkProcess = async (req, res) => {
  try {
    const { stepNumber, title, description } = req.body;
    let image = req.files && req.files.image
      ? `/uploads/work-process/${req.files.image[0].filename}`
      : null;

    const newStep = new WorkProcess({ stepNumber, title, description, image });
    await newStep.save();

    res.status(201).json(newStep);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE step
const updateWorkProcess = async (req, res) => {
  try {
    const { id } = req.params;
    const { stepNumber, title, description } = req.body;

    let image = req.files && req.files.image
      ? `/uploads/work-process/${req.files.image[0].filename}`
      : undefined;

    const updatedStep = await WorkProcess.findByIdAndUpdate(
      id,
      {
        stepNumber,
        title,
        description,
        ...(image && { image }),
      },
      { new: true }
    );

    res.status(200).json(updatedStep);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// DELETE step
const deleteWorkProcess = async (req, res) => {
  try {
    const { id } = req.params;
    await WorkProcess.findByIdAndDelete(id);
    res.status(200).json({ message: "Step deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE multiple steps
const deleteMultipleWorkProcesses = async (req, res) => {
  try {
    const { ids } = req.body; // array of step _id
    await WorkProcess.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: "Steps deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getWorkProcesses,
  createWorkProcess,
  updateWorkProcess,
  deleteWorkProcess,
  deleteMultipleWorkProcesses,
};
