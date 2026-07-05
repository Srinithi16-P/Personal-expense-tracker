const Notification = require("../models/notificationModel");

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(100);
    const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });
    res.status(200).json({ success: true, unreadCount, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch notifications." });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ success: false, message: "Notification not found." });
    res.status(200).json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update notification." });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
    res.status(200).json({ success: true, message: "All notifications marked as read." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update notifications." });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!notification) return res.status(404).json({ success: false, message: "Notification not found." });
    res.status(200).json({ success: true, message: "Notification deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete notification." });
  }
};

module.exports = { getNotifications, markAsRead, markAllAsRead, deleteNotification };
