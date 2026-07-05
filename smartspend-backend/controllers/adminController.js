const User = require("../models/userModel");
const Expense = require("../models/expenseModel");
const Income = require("../models/incomeModel");
const Feedback = require("../models/feedbackModel");
const Announcement = require("../models/announcementModel");
const Notification = require("../models/notificationModel");
const Category = require("../models/categoryModel");
const { emitToUser } = require("../config/socket");
const { sendEmail, templates } = require("../services/emailService");
const { normalizeLabel } = require("../utils/normalize");

const getSystemStats = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [totalUsers, activeUsers, newUsersToday, totalExpenses, totalIncomes, expensesToday, topCategoryAgg] =
      await Promise.all([
        User.countDocuments({ role: 0 }),
        User.countDocuments({ role: 0, isActive: true }),
        User.countDocuments({ role: 0, createdAt: { $gte: startOfToday } }),
        Expense.countDocuments(),
        Income.countDocuments(),
        Expense.countDocuments({ date: { $gte: startOfToday } }),
        Expense.aggregate([
          { $group: { _id: "$category", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 1 },
        ]),
      ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        newUsersToday,
        totalTransactions: totalExpenses + totalIncomes,
        expensesToday,
        mostUsedCategory: topCategoryAgg[0]?._id || "N/A",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch system stats." });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 0 }).select("-password -resetPasswordToken -resetPasswordExpire").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch users." });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    if (user.role === 1) return res.status(400).json({ success: false, message: "Cannot deactivate another admin." });

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({ success: true, message: `User ${user.isActive ? "activated" : "deactivated"}.` });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update user status." });
  }
};

const createAnnouncement = async (req, res) => {
  try {
    const { title, message } = req.body;
    const announcement = await Announcement.create({ title, message, createdBy: req.user._id });

    const users = await User.find({ isActive: true, role: 0 }).select("_id email name");
    const notifications = users.map((u) => ({ user: u._id, title, message, type: "announcement" }));
    const created = await Notification.insertMany(notifications);

    created.forEach((n) => emitToUser(n.user, "notification", n));

    const { subject, html } = templates.announcement(title, message);
    users.forEach((u) => sendEmail({ to: u.email, subject, html })); // fire and forget, in parallel

    res.status(201).json({ success: true, message: `Announcement sent to ${users.length} users.`, announcement });
  } catch (error) {
    console.error("Announcement Error:", error);
    res.status(500).json({ success: false, message: "Failed to send announcement." });
  }
};

const getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().populate("user", "name email").sort({ createdAt: -1 });
    res.status(200).json({ success: true, feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch feedback." });
  }
};

const updateFeedbackStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["open", "reviewed", "resolved"].includes(status)) {
      return res.status(422).json({ success: false, message: "Invalid status." });
    }
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!feedback) return res.status(404).json({ success: false, message: "Feedback not found." });
    emitToUser(feedback.user, "feedback_status_updated", feedback);
    res.status(200).json({ success: true, feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update feedback." });
  }
};

// Admin manages the global default categories every user sees
const addDefaultCategory = async (req, res) => {
  try {
    const { name, type } = req.body;
    const category = await Category.create({ name: normalizeLabel(name), type, isDefault: true, user: null });
    res.status(201).json({ success: true, message: "Default category added.", category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add default category." });
  }
};

const deleteDefaultCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({ _id: req.params.id, isDefault: true });
    if (!category) return res.status(404).json({ success: false, message: "Default category not found." });
    res.status(200).json({ success: true, message: "Default category deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete category." });
  }
};

module.exports = {
  getSystemStats,
  getAllUsers,
  toggleUserStatus,
  createAnnouncement,
  getFeedback,
  updateFeedbackStatus,
  addDefaultCategory,
  deleteDefaultCategory,
};
