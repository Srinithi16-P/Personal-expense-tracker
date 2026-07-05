const User = require("../models/userModel");
const { hashPassword, comparePassword } = require("../helpers/authHelper");

const getProfile = async (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      monthlyIncome: user.monthlyIncome,
      currency: user.currency,
      profileImage: user.profileImage,
      role: user.role,
    },
  });
};

const updateProfile = async (req, res) => {
  try {
    const allowed = ["name", "monthlyIncome", "currency", "profileImage"];
    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, message: "Profile updated.", user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update profile." });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Current password is incorrect." });
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    res.status(200).json({ success: true, message: "Password changed successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to change password." });
  }
};

module.exports = { getProfile, updateProfile, changePassword };
