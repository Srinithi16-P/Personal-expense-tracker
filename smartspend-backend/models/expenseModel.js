const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    category: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: [1, "Amount must be greater than 0"] },
    date: { type: Date, default: Date.now },
    notes: { type: String, trim: true, default: "" },
    paymentMethod: { type: String, enum: ["cash", "card", "upi", "other"], default: "upi" },
    merchant: { type: String, trim: true, default: "" },
    isRecurring: { type: Boolean, default: false },
  },
  { timestamps: true }
);

expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model("Expense", expenseSchema);
