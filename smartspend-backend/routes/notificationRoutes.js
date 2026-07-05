const express = require("express");
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notificationController");
const { requireSignIn } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", requireSignIn, getNotifications);
router.put("/read/:id", requireSignIn, markAsRead);
router.put("/read-all", requireSignIn, markAllAsRead);
router.delete("/:id", requireSignIn, deleteNotification);

module.exports = router;
