const mongoose = require("mongoose");
const Income = require("../models/incomeModel");
const Expense = require("../models/expenseModel");
const { getBudgetHealthLabel } = require("../utils/budgetHealth");
const Budget = require("../models/budgetModel");

const getDashboardSummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const [incomeAgg, expenseAgg, recentExpenses] = await Promise.all([
      Income.aggregate([
        { $match: { user: userId, date: { $gte: startOfMonth, $lt: startOfNextMonth } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Expense.aggregate([
        { $match: { user: userId, date: { $gte: startOfMonth, $lt: startOfNextMonth } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Expense.find({ user: userId }).sort({ date: -1 }).limit(5),
    ]);

    const monthlyIncome = incomeAgg[0]?.total || 0;
    const monthlyExpense = expenseAgg[0]?.total || 0;

    res.status(200).json({
      success: true,
      summary: {
        monthlyIncome,
        monthlyExpense,
        savings: monthlyIncome - monthlyExpense,
        recentExpenses,
      },
    });
  } catch (error) {
    console.error("Dashboard Summary Error:", error);
    res.status(500).json({ success: false, message: "Failed to build dashboard summary." });
  }
};


const getCategoryBreakdown = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const now = new Date();
    const month = Number(req.query.month) || now.getMonth() + 1;
    const year = Number(req.query.year) || now.getFullYear();

    const breakdown = await Expense.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) },
        },
      },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
    ]);

    const grandTotal = breakdown.reduce((sum, c) => sum + c.total, 0);
    const withPercent = breakdown.map((c) => ({
      category: c._id,
      total: c.total,
      percent: grandTotal ? Math.round((c.total / grandTotal) * 100) : 0,
    }));

    res.status(200).json({ success: true, month, year, grandTotal, breakdown: withPercent });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to build category breakdown." });
  }
};

// Last 6 months income vs expense — for the line/bar trend chart
const getMonthlyTrend = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [incomeByMonth, expenseByMonth] = await Promise.all([
      Income.aggregate([
        { $match: { user: userId, date: { $gte: start } } },
        { $group: { _id: { y: { $year: "$date" }, m: { $month: "$date" } }, total: { $sum: "$amount" } } },
      ]),
      Expense.aggregate([
        { $match: { user: userId, date: { $gte: start } } },
        { $group: { _id: { y: { $year: "$date" }, m: { $month: "$date" } }, total: { $sum: "$amount" } } },
      ]),
    ]);

    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ year: d.getFullYear(), month: d.getMonth() + 1 });
    }

    const find = (arr, y, m) => arr.find((x) => x._id.y === y && x._id.m === m)?.total || 0;

    const trend = months.map(({ year, month }) => ({
      year,
      month,
      income: find(incomeByMonth, year, month),
      expense: find(expenseByMonth, year, month),
    }));

    res.status(200).json({ success: true, trend });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to build monthly trend." });
  }
};


const getSavingsPrediction = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 3, 1);

    const [incomeAgg, expenseAgg] = await Promise.all([
      Income.aggregate([
        { $match: { user: userId, date: { $gte: start } } },
        { $group: { _id: { y: { $year: "$date" }, m: { $month: "$date" } }, total: { $sum: "$amount" } } },
      ]),
      Expense.aggregate([
        { $match: { user: userId, date: { $gte: start } } },
        { $group: { _id: { y: { $year: "$date" }, m: { $month: "$date" } }, total: { $sum: "$amount" } } },
      ]),
    ]);

    const avg = (arr) => (arr.length ? arr.reduce((s, x) => s + x.total, 0) / arr.length : 0);
    const avgIncome = avg(incomeAgg);
    const avgExpense = avg(expenseAgg);
    const predictedSavings = Math.round(avgIncome - avgExpense);

    res.status(200).json({
      success: true,
      basedOnMonths: incomeAgg.length || expenseAgg.length,
      avgMonthlyIncome: Math.round(avgIncome),
      avgMonthlyExpense: Math.round(avgExpense),
      predictedNextMonthSavings: predictedSavings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to predict savings." });
  }
};


const getSpendingPersonality = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const breakdown = await Expense.aggregate([
      { $match: { user: userId, date: { $gte: startOfMonth } } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
    ]);

    if (!breakdown.length) {
      return res.status(200).json({ success: true, personality: "No spending recorded yet this month.", topCategory: null });
    }

    const grandTotal = breakdown.reduce((sum, c) => sum + c.total, 0);
    const top = breakdown[0];
    const topPercent = Math.round((top.total / grandTotal) * 100);

    let personality;
    if (topPercent >= 50) personality = `You're heavily focused on ${top._id} — it's ${topPercent}% of this month's spending.`;
    else if (breakdown.length >= 5) personality = "You're a balanced spender across several categories.";
    else personality = `Your biggest spending category is ${top._id} at ${topPercent}%.`;

    res.status(200).json({ success: true, personality, topCategory: top._id, topPercent });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to analyze spending personality." });
  }
};

module.exports = {
  getDashboardSummary,
  getCategoryBreakdown,
  getMonthlyTrend,
  getSavingsPrediction,
  getSpendingPersonality,
};
