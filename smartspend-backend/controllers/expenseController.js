const Expense = require("../models/expenseModel");
const { checkBudgetHealth } = require("../utils/budgetHealth");
const { emitToUser } = require("../config/socket");
const { normalizeLabel } = require("../utils/normalize");

const addExpense = async (req, res) => {
  try {
    const { category, amount, date, notes, paymentMethod, merchant, isRecurring } = req.body;

    const expense = await Expense.create({
      user: req.user._id,
      category: normalizeLabel(category),
      amount,
      date: date || Date.now(),
      notes,
      paymentMethod,
      merchant,
      isRecurring,
    });

    emitToUser(req.user._id, "expense_added", expense); // realtime dashboard update
    checkBudgetHealth(req.user._id, expense.category, expense.date); // async, non-blocking

    res.status(201).json({ success: true, message: "Expense added.", expense });
  } catch (error) {
    console.error("Add Expense Error:", error);
    res.status(500).json({ success: false, message: "Failed to add expense." });
  }
};

const getExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate, page = 1, limit = 50 } = req.query;
    const filter = { user: req.user._id };

    if (category) filter.category = normalizeLabel(category);
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [expenses, total] = await Promise.all([
      Expense.find(filter).sort({ date: -1 }).skip(skip).limit(Number(limit)),
      Expense.countDocuments(filter),
    ]);

    res.status(200).json({ success: true, count: expenses.length, total, page: Number(page), expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch expenses." });
  }
};

const updateExpense = async (req, res) => {
  try {
    if (req.body.category) req.body.category = normalizeLabel(req.body.category);
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!expense) return res.status(404).json({ success: false, message: "Expense not found." });

    checkBudgetHealth(req.user._id, expense.category, expense.date);
    res.status(200).json({ success: true, message: "Expense updated.", expense });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update expense." });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!expense) return res.status(404).json({ success: false, message: "Expense not found." });
    res.status(200).json({ success: true, message: "Expense deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete expense." });
  }
};

module.exports = { addExpense, getExpenses, updateExpense, deleteExpense };
