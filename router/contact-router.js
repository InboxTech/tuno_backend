const express = require("express");
const router = express.Router();
const {
  contactForm,
  getAllContact,
  deleteContactById,
  deleteMultipleContact,
  sendContactEmail
} = require("../controllers/contact-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const adminMidelware = require("../middlewares/admin-middleware");

router.route("/contact").post(contactForm);
router.route("/contact/sendEmail").post(sendContactEmail);
router.route("/userContact").get(authMiddleware, getAllContact);
router
  .route("/contacts/delete/:id")
  .delete(authMiddleware, adminMidelware, deleteContactById);
router
  .route("/contacts/delete-multiple-contacts")
  .post(authMiddleware, adminMidelware, deleteMultipleContact);

  
module.exports = router;
