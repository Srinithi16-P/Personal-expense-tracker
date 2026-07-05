const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: [true, "Password is required"], select: false },
    monthlyIncome: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: "INR" },
    profileImage: { type: String, default: "" },
    role: { type: Number, enum: [0, 1], default: 0 }, // 0 = user, 1 = admin
    isActive: { type: Boolean, default: true },
    resetPasswordToken: { type: String, default: null, select: false },
    resetPasswordExpire: { type: Date, default: null, select: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
