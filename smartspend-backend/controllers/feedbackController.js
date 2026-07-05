const Feedback = require("../models/feedbackModel");
const { broadcast } = require("../config/socket");

const submitFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.create({ user: req.user._id, message: req.body.message.trim() });
    const populated = await feedback.populate("user", "name email");

    broadcast("new_feedback", populated);

    res.status(201).json({ success: true, message: "Feedback submitted. Thank you!", feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to submit feedback." });
  }
};

const getMyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch feedback." });
  }
};

module.exports = { submitFeedback, getMyFeedback };
