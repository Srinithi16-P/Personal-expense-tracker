const Goal = require("../models/goalModel");
const Notification = require("../models/notificationModel");
const { emitToUser } = require("../config/socket");
const { sendEmail, templates } = require("../services/emailService");

const createGoal = async (req, res) => {
  try {
    const { title, targetAmount, deadline } = req.body;
    const goal = await Goal.create({ user: req.user._id, title, targetAmount, deadline });
    res.status(201).json({ success: true, message: "Goal created.", goal });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create goal." });
  }
};

const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
    const withProgress = goals.map((g) => ({
      ...g.toObject(),
      progressPercent: Math.min(Math.round((g.savedAmount / g.targetAmount) * 100), 100),
    }));
    res.status(200).json({ success: true, goals: withProgress });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch goals." });
  }
};

const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    if (!goal) return res.status(404).json({ success: false, message: "Goal not found." });

    const allowed = ["title", "targetAmount", "savedAmount", "deadline"];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) goal[field] = req.body[field];
    });

    const justCompleted = goal.savedAmount >= goal.targetAmount && !goal.isCompleted;
    if (justCompleted) {
      goal.isCompleted = true;

      const notification = await Notification.create({
        user: req.user._id,
        title: "Goal Achieved! 🎉",
        message: `You've reached your goal: ${goal.title}`,
        type: "goal_completed",
      });
      emitToUser(req.user._id, "notification", notification);

      const { subject, html } = templates.goalAchieved(req.user.name, goal.title);
      sendEmail({ to: req.user.email, subject, html });
    }

    await goal.save();
    res.status(200).json({ success: true, message: "Goal updated.", goal });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update goal." });
  }
};

const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!goal) return res.status(404).json({ success: false, message: "Goal not found." });
    res.status(200).json({ success: true, message: "Goal deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete goal." });
  }
};

module.exports = { createGoal, getGoals, updateGoal, deleteGoal };
