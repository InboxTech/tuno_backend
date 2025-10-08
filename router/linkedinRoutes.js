const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload-middleware");
const { uploadHandler } = require("../middlewares/upload-middleware");
const {
  addLinkedInPost,
  getAllLinkedInPosts,
  updateLinkedInPost,
  deleteLinkedInPost,
  deleteMultipleLinkedInPosts,
} = require("../controllers/linkedinController");

const authMiddleware = require("../middlewares/auth-middleware");
const adminMiddleware = require("../middlewares/admin-middleware");

// ---------------- Public route (frontend) ----------------
router.route("/linkedin").get(getAllLinkedInPosts);

// ---------------- Admin routes ----------------
// Create new post
router
  .route("/linkedin")
  .post(
    authMiddleware,
    adminMiddleware,
    uploadHandler([{ name: "image", maxCount: 1 }]),
    addLinkedInPost
  );

// Update post
router
  .route("/linkedin/:id")
  .put(
    authMiddleware,
    adminMiddleware,
    uploadHandler([{ name: "image", maxCount: 1 }]),
    updateLinkedInPost
  );

// Delete single post
router
  .route("/linkedin/delete/:id")
  .delete(authMiddleware, adminMiddleware, deleteLinkedInPost);

// Delete multiple posts
router
  .route("/linkedin/delete-multiple")
  .post(authMiddleware, adminMiddleware, deleteMultipleLinkedInPosts);

module.exports = router;
