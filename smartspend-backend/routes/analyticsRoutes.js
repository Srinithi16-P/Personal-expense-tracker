const express = require("express");
const {
  getDashboardSummary,
  getCategoryBreakdown,
  getMonthlyTrend,
  getSavingsPrediction,
  getSpendingPersonality,
} = require("../controllers/analyticsController");
const { requireSignIn } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/dashboard", requireSignIn, getDashboardSummary);
router.get("/category", requireSignIn, getCategoryBreakdown);
router.get("/monthly", requireSignIn, getMonthlyTrend);
router.get("/savings-prediction", requireSignIn, getSavingsPrediction);
router.get("/spending-personality", requireSignIn, getSpendingPersonality);

module.exports = router;
