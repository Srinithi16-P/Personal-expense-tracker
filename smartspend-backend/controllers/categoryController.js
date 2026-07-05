const Category = require("../models/categoryModel");
const { normalizeLabel } = require("../utils/normalize");

const getCategories = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { $or: [{ isDefault: true }, { user: req.user._id }] };
    if (type) filter.type = type;
    const categories = await Category.find(filter).sort({ isDefault: -1, name: 1 });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch categories." });
  }
};

const addCategory = async (req, res) => {
  try {
    const { name, type } = req.body;
    const category = await Category.create({ name: normalizeLabel(name), type, user: req.user._id, isDefault: false });
    res.status(201).json({ success: true, message: "Category added.", category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add category." });
  }
};

const deleteCategory = async (req, res) => {
  try {
   
    const category = await Category.findOneAndDelete({ _id: req.params.id, user: req.user._id, isDefault: false });
    if (!category) return res.status(404).json({ success: false, message: "Category not found." });
    res.status(200).json({ success: true, message: "Category deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete category." });
  }
};

module.exports = { getCategories, addCategory, deleteCategory };
