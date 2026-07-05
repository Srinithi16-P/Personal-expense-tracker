const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    category: { type: String, required: true, trim: true },
    limit: { type: Number, required: true, min: [1, "Limit must be greater than 0"] },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
    alertSent90: { type: Boolean, default: false },
    alertSent100: { type: Boolean, default: false },
  },
  { timestamps: true }
);

budgetSchema.index({ user: 1, category: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("Budget", budgetSchema);
