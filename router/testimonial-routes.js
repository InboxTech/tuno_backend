const express = require("express");
const router = express.Router();
const { uploadHandler } = require("../middlewares/upload-middleware");
const {
  createTestimonial,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
  deleteMultipleTestimonials,
  getFrontendTestimonial
} = require("../controllers/testimonial-controller");

const authMiddleware = require("../middlewares/auth-middleware");
const adminMiddleware = require("../middlewares/admin-middleware");

//  Get all testimonials
router.route("/testimonial").get(getAllTestimonials);
// Public/Frontend route
router.get("/frontend/testimonial", getFrontendTestimonial);
//  Create new testimonial
router
  .route("/testimonial/create")
  .post(
    authMiddleware,
    adminMiddleware,
    uploadHandler([{ name: "image", maxCount: 1 }]),
    createTestimonial
  );

//  Get one testimonial
router.route("/testimonial/:id").get(getTestimonialById);

//  Update one testimonial
router
  .route("/testimonial/update/:id")
  .put(
    authMiddleware,
    adminMiddleware,
       uploadHandler([{ name: "image", maxCount: 1 }]),
    updateTestimonial
  );

//  Delete one testimonial
router
  .route("/testimonial/delete/:id")
  .delete(authMiddleware, adminMiddleware, deleteTestimonial);

//  Delete multiple testimonials
router
  .route("/testimonial/delete-multiple")
  .post(authMiddleware, adminMiddleware, deleteMultipleTestimonials);

module.exports = router;
