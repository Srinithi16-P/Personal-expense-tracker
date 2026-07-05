const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true, trim: true, minlength: 5 },
    status: { type: String, enum: ["open", "reviewed", "resolved"], default: "open" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
