const nodemailer = require("nodemailer");

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("Email not sent: EMAIL_USER/EMAIL_PASS missing in .env".yellow);
      return;
    }
    await getTransporter().sendMail({
      from: `"SmartSpend" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Email send failed:", error.message);
  }
};

const templates = {
  welcome: (name) => ({
    subject: "Welcome to SmartSpend!",
    html: `<h2>Welcome, ${name}!</h2><p>Your SmartSpend account is ready. Start by adding your monthly income and setting up your first budget.</p><p>— SmartSpend Team</p>`,
  }),
  resetPassword: (name, resetURL) => ({
    subject: "SmartSpend Password Reset",
    html: `<h2>Password Reset Request</h2><p>Hello ${name},</p><p>Click the link below to reset your password. This link expires in 10 minutes.</p><a href="${resetURL}">${resetURL}</a><p>If you didn't request this, ignore this email.</p>`,
  }),
  budgetAlert: (name, category, limit, spent, exceeded) => ({
    subject: exceeded ? `Budget Exceeded - ${category}` : `Budget Alert - ${category}`,
    html: `<h3>${exceeded ? "Budget Exceeded" : "Budget Warning"}: ${category}</h3><p>Hi ${name},</p><p>${exceeded ? "You have exceeded" : "You have used most of"} your ${category} budget this month.</p><p>Budget: ₹${limit}<br/>Spent: ₹${spent}<br/>Remaining: ₹${Math.max(limit - spent, 0)}</p><p>— SmartSpend Team</p>`,
  }),
  goalAchieved: (name, title) => ({
    subject: "Goal Achieved! 🎉",
    html: `<h2>Congratulations, ${name}!</h2><p>You've reached your goal: <b>${title}</b>.</p><p>— SmartSpend Team</p>`,
  }),
  announcement: (title, message) => ({
    subject: `Announcement: ${title}`,
    html: `<h3>${title}</h3><p>${message}</p><p>— SmartSpend Team</p>`,
  }),
};

module.exports = { sendEmail, templates };
