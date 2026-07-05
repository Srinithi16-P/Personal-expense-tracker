const express = require("express");
const { getProfile, updateProfile, changePassword } = require("../controllers/userController");
const { requireSignIn } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { changePasswordValidator } = require("../validators/authValidator");

const router = express.Router();

router.get("/profile", requireSignIn, getProfile);
router.put("/profile", requireSignIn, updateProfile);
router.put("/change-password", requireSignIn, changePasswordValidator, validate, changePassword);

module.exports = router;
