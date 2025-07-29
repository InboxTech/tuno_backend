const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth-controller");
// const authValidator = require("../validators/auth-validator");
const {signupSchema, loginSchema} = require("../validators/auth-validator");
const validate = require("../middlewares/validate-middleware");
const authMiddleware = require("../middlewares/auth-middleware");


router.route("/").get(authControllers.home);
// router.route("/register").post( validate(authValidator.signupSchema), authControllers.register);
router.route("/register").post( validate(signupSchema), authControllers.register);
router.route("/login").post( validate(loginSchema), authControllers.login);
// router.route("/login").post(authControllers.login);
router.route("/user").get(authMiddleware, authControllers.user);
router.patch("/change-password", authMiddleware, authControllers.changePassword);
// @route   POST /api/auth/forgot-password
router.post("/forgot-password", authControllers.forgotPassword);
router.post("/reset-password/:token", authControllers.resetPassword);

module.exports = router;