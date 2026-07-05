const express = require("express");
const {
  getSystemStats,
  getAllUsers,
  toggleUserStatus,
  createAnnouncement,
  getFeedback,
  updateFeedbackStatus,
  addDefaultCategory,
  deleteDefaultCategory,
} = require("../controllers/adminController");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { categoryValidator } = require("../validators/transactionValidator");
const { body } = require("express-validator");

const router = express.Router();
router.use(requireSignIn, isAdmin); // every route below requires an authenticated admin

router.get("/system-stats", getSystemStats);
router.get("/users", getAllUsers);
router.put("/user-status/:id", toggleUserStatus);

router.post(
  "/announcement",
  [body("title").trim().notEmpty().withMessage("Title is required."), body("message").trim().notEmpty().withMessage("Message is required.")],
  validate,
  createAnnouncement
);

router.get("/feedback", getFeedback);
router.put("/feedback/:id", updateFeedbackStatus);

router.post("/categories", categoryValidator, validate, addDefaultCategory);
router.delete("/categories/:id", deleteDefaultCategory);

module.exports = router;
