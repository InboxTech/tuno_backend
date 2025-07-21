const express = require("express");
const router = express.Router();
const { uploadHandler } = require("../middlewares/upload-middleware");
const {
  createProject,
  getAllProjects,
  getSingleProject,
  updateProject,
  softDeleteProject,
  softDeleteSelectedProjects,
  restoreProject,
} = require("../controllers/project-controller");

const authMiddleware = require("../middlewares/auth-middleware");
const adminMiddleware = require("../middlewares/admin-middleware");

//  Get all projects
router.route("/project").get(getAllProjects);

//  Create new project
router.route("/project/create").post(
  authMiddleware,
  adminMiddleware,
  uploadHandler([
    { name: "projectImage", maxCount: 1 }, 
    { name: "projectImages", maxCount: 5 }, 
  ]),
  createProject
);

//  Get single project by ID
router.route("/project/:id").get(getSingleProject);

//  Update project
router.route("/project/update/:id").put(
  authMiddleware,
  adminMiddleware,
  uploadHandler([
    { name: "projectImage", maxCount: 1 }, 
    { name: "projectImages", maxCount: 5 }, 
  ]),
  updateProject
);

//  Soft delete single project
router
  .route("/project/delete/:id")
  .delete(authMiddleware, adminMiddleware, softDeleteProject);

//  Soft delete multiple (bulk)
router
  .route("/project/delete-multiple")
  .post(authMiddleware, adminMiddleware, softDeleteSelectedProjects);

//  Restore deleted project
router
  .route("/project/restore/:id")
  .patch(authMiddleware, adminMiddleware, restoreProject);

module.exports = router;
