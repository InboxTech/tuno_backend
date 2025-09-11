const express = require("express");
const blogsController = require("../controllers/blog-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const adminMiddleware = require("../middlewares/admin-middleware");
const { uploadHandler } = require("../middlewares/upload-middleware");
const router = express.Router();

// for client 
router.route("/blog").get( blogsController.blogs);
router.route("/blog/:id").get(blogsController.getBlogById);
router.route("/getRelatedBlog/:id").get(blogsController.getRelatedBlogs);

// for admin || create new blog
router.route("/blogs").get(authMiddleware, adminMiddleware, blogsController.getblogs);
router.route("/blogs/create").post(authMiddleware,adminMiddleware,uploadHandler([{ name: "image", maxCount: 1}, { name: "thumbnail_image", maxCount: 1 }]), blogsController.createBlog);
router.route("/blogs/update/:id").put(authMiddleware, adminMiddleware, uploadHandler([{ name: "image", maxCount: 1 }, { name: "thumbnail_image", maxCount: 1 }]), blogsController.updateBlog);
router.route("/blogs/delete/:id").delete(authMiddleware, adminMiddleware, blogsController.deleteBlog);
router.route("/blogs/multiple-delete").post(authMiddleware, adminMiddleware, blogsController.deleteMultipleBlogs);

module.exports = router;