const Budget = require("../models/budgetModel");
const Expense = require("../models/expenseModel");
const { getBudgetHealthLabel } = require("../utils/budgetHealth");
const { normalizeLabel } = require("../utils/normalize");

const createBudget = async (req, res) => {
  try {
    const category = normalizeLabel(req.body.category);
    const { limit, month, year } = req.body;

    const existing = await Budget.findOne({ user: req.user._id, category, month, year });
    if (existing) {
      return res.status(409).json({ success: false, message: "Budget already set for this category and month." });
    }

    const budget = await Budget.create({ user: req.user._id, category, limit, month, year });
    res.status(201).json({ success: true, message: "Budget created.", budget });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create budget." });
  }
};


const getBudgets = async (req, res) => {
  try {
    const now = new Date();
    const month = Number(req.query.month) || now.getMonth() + 1;
    const year = Number(req.query.year) || now.getFullYear();

    const budgets = await Budget.find({ user: req.user._id, month, year });

    const enriched = await Promise.all(
      budgets.map(async (b) => {
        const result = await Expense.aggregate([
          {
            $match: {
              user: b.user,
              category: b.category,
              date: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) },
            },
          },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);
        const spent = result[0]?.total || 0;
        const percentUsed = Math.min(Math.round((spent / b.limit) * 100), 999);
        return {
          ...b.toObject(),
          spent,
          remaining: Math.max(b.limit - spent, 0),
          percentUsed,
          ...getBudgetHealthLabel(percentUsed),
        };
      })
    );

    res.status(200).json({ success: true, budgets: enriched });
  } catch (error) {
    console.error("Get Budgets Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch budgets." });
  }
};

const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { limit: req.body.limit, alertSent90: false, alertSent100: false },
      { new: true, runValidators: true }
    );
    if (!budget) return res.status(404).json({ success: false, message: "Budget not found." });
    res.status(200).json({ success: true, message: "Budget updated.", budget });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update budget." });
  }
};

const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!budget) return res.status(404).json({ success: false, message: "Budget not found." });
    res.status(200).json({ success: true, message: "Budget deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete budget." });
  }
};

module.exports = { createBudget, getBudgets, updateBudget, deleteBudget };
