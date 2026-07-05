const JWT = require("jsonwebtoken");
const User = require("../models/userModel");

const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User no longer exists." });
    }
    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "Your account has been deactivated." });
    }

    req.user = user; // full mongoose doc, req.user._id / req.user.role available
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token. Please login again." });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 1) {
    return res.status(403).json({ success: false, message: "Admins only." });
  }
  next();
};

module.exports = { requireSignIn, isAdmin };
