const express = require("express");
const {
  registerController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
  meController,
} = require("../controllers/authController");
const { requireSignIn } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validators/authValidator");

const router = express.Router();

router.post("/register", registerValidator, validate, registerController);
router.post("/login", loginValidator, validate, loginController);
router.post("/forgot-password", forgotPasswordValidator, validate, forgotPasswordController);
router.post("/reset-password/:token", resetPasswordValidator, validate, resetPasswordController);
router.get("/me", requireSignIn, meController);

module.exports = router;
