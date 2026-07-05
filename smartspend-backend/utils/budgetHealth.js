const Budget = require("../models/budgetModel");
const Expense = require("../models/expenseModel");
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");
const { emitToUser } = require("../config/socket");
const { sendEmail, templates } = require("../services/emailService");
const checkBudgetHealth = async (userId, category, date) => {
  try {
    const d = new Date(date);
    const month = d.getMonth() + 1;
    const year = d.getFullYear();

    const budget = await Budget.findOne({ user: userId, category, month, year });
    if (!budget) return;

    const result = await Expense.aggregate([
      {
        $match: {
          user: budget.user,
          category,
          date: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const spent = result[0]?.total || 0;
    const percentUsed = (spent / budget.limit) * 100;
    const user = await User.findById(userId);
    if (!user) return;

    if (percentUsed >= 100 && !budget.alertSent100) {
      await fireAlert(user, category, budget.limit, spent, true, "budget_exceeded");
      budget.alertSent100 = true;
      await budget.save();
    } else if (percentUsed >= 90 && !budget.alertSent90) {
      await fireAlert(user, category, budget.limit, spent, false, "budget_warning");
      budget.alertSent90 = true;
      await budget.save();
    }
  } catch (error) {
    console.error("Budget health check failed:", error.message);
  }
};

const fireAlert = async (user, category, limit, spent, exceeded, type) => {
  const { subject, html } = templates.budgetAlert(user.name, category, limit, spent, exceeded);

  const notification = await Notification.create({
    user: user._id,
    title: subject,
    message: `Budget ₹${limit}, Spent ₹${spent}`,
    type,
  });

  emitToUser(user._id, "notification", notification);
  await sendEmail({ to: user.email, subject, html });
};

const getBudgetHealthLabel = (percentUsed) => {
  if (percentUsed >= 100) return { status: "Exceeded", color: "red" };
  if (percentUsed >= 75) return { status: "Warning", color: "yellow" };
  return { status: "Healthy", color: "green" };
};

module.exports = { checkBudgetHealth, getBudgetHealthLabel };
