const Income = require("../models/incomeModel");

const addIncome = async (req, res) => {
  try {
    const { source, amount, date, notes } = req.body;
    const income = await Income.create({
      user: req.user._id,
      source: source.trim(),
      amount,
      date: date || Date.now(),
      notes,
    });
    res.status(201).json({ success: true, message: "Income added.", income });
  } catch (error) {
    console.error("Add Income Error:", error);
    res.status(500).json({ success: false, message: "Failed to add income." });
  }
};

const getIncomes = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = { user: req.user._id };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    const incomes = await Income.find(filter).sort({ date: -1 });
    res.status(200).json({ success: true, count: incomes.length, incomes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch incomes." });
  }
};

const updateIncome = async (req, res) => {
  try {
    const income = await Income.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!income) return res.status(404).json({ success: false, message: "Income not found." });
    res.status(200).json({ success: true, message: "Income updated.", income });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update income." });
  }
};

const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!income) return res.status(404).json({ success: false, message: "Income not found." });
    res.status(200).json({ success: true, message: "Income deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete income." });
  }
};

module.exports = { addIncome, getIncomes, updateIncome, deleteIncome };
