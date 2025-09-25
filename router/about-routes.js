const express = require("express");
const router = express.Router();
const { uploadHandler } = require("../middlewares/upload-middleware");

const {
  createAbout,
  getAllAbout,
  updateAbout,
  deleteAbout,
  getFrontendAbout
} = require("../controllers/about-controller");

const authMiddleware = require("../middlewares/auth-middleware");
const adminMiddleware = require("../middlewares/admin-middleware");

//  Get all About entries (admin)
router.route("/about").get( getAllAbout);

// Public/Frontend route
router.get("/frontend/about", getFrontendAbout);

//  Create new About entry
router
  .route("/about/create")
  .post(
    authMiddleware,
    adminMiddleware,
    uploadHandler([
      { name: "wave1", maxCount: 1 },
      { name: "wave2", maxCount: 1 },
      { name: "wave3", maxCount: 1 },
    ]),
    createAbout
  );



//  Update one About entry
router
  .route("/about/update/:id")
  .put(
    authMiddleware,
    adminMiddleware,
    uploadHandler([
      { name: "wave1", maxCount: 1 },
      { name: "wave2", maxCount: 1 },
      { name: "wave3", maxCount: 1 },
    ]),
    updateAbout
  );

//  Delete one About entry
router
  .route("/about/delete/:id")
  .delete(authMiddleware, adminMiddleware, deleteAbout);

module.exports = router;
