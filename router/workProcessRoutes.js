const express = require("express");
const router = express.Router();
const {
  createWorkProcess,
  getWorkProcesses,
  updateWorkProcess,
  deleteWorkProcess,
  deleteMultipleWorkProcesses,
} = require("../controllers/workProcessController");

const { uploadHandler } = require("../middlewares/upload-middleware");

// Get all work process steps
router.route("/workprocess").get(getWorkProcesses);

// Create new step
router
  .route("/create")
  .post(uploadHandler([{ name: "image", maxCount: 1 }]), createWorkProcess);

// Update a step
router
  .route("/update/:id")
  .put(uploadHandler([{ name: "image", maxCount: 1 }]), updateWorkProcess);

// Delete a single step
router
  .route("/delete/:id")
  .delete(deleteWorkProcess);

// Delete multiple steps
router
  .route("/delete-multiple")
  .post(deleteMultipleWorkProcesses);

module.exports = router;
