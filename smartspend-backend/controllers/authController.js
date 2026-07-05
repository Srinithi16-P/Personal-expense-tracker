const crypto = require("crypto");
const User = require("../models/userModel");
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const generateToken = require("../utils/generateToken");
const { sendEmail, templates } = require("../services/emailService");

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  monthlyIncome: user.monthlyIncome,
  currency: user.currency,
  profileImage: user.profileImage,
  role: user.role,
  createdAt: user.createdAt,
});

const registerController = async (req, res) => {
  try {
    const { name, email, password, monthlyIncome, currency } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already registered." });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      monthlyIncome: monthlyIncome || 0,
      currency: currency || "INR",
    });

    const { subject, html } = templates.welcome(user.name);
    sendEmail({ to: user.email, subject, html }); // fire and forget

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "Registration successful!",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ success: false, message: "Server error during registration." });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user) {
      return res.status(404).json({ success: false, message: "Email not registered." });
    }
    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "Your account has been deactivated." });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect password." });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "Server error during login." });
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    const genericResponse = { success: true, message: "If this email is registered, a reset link has been sent." };
    if (!user) return res.status(200).json(genericResponse);

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;
    const { subject, html } = templates.resetPassword(user.name, resetURL);
    await sendEmail({ to: user.email, subject, html });

    return res.status(200).json(genericResponse);
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ success: false, message: "Could not process password reset." });
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Reset link is invalid or expired." });
    }

    user.password = await hashPassword(password);
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    return res.status(200).json({ success: true, message: "Password reset successful." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ success: false, message: "Password reset failed." });
  }
};

const meController = async (req, res) => {
  return res.status(200).json({ success: true, user: publicUser(req.user) });
};

module.exports = {
  registerController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
  meController,
};
