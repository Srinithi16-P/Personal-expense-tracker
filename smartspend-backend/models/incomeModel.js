const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    source: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: [1, "Amount must be greater than 0"] },
    date: { type: Date, default: Date.now },
    notes: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Income", incomeSchema);
