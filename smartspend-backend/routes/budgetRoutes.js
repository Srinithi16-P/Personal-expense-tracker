const express = require("express");
const { createBudget, getBudgets, updateBudget, deleteBudget } = require("../controllers/budgetController");
const { requireSignIn } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { budgetValidator } = require("../validators/transactionValidator");

const router = express.Router();

router.post("/create", requireSignIn, budgetValidator, validate, createBudget);
router.get("/", requireSignIn, getBudgets);
router.put("/:id", requireSignIn, updateBudget);
router.delete("/:id", requireSignIn, deleteBudget);

module.exports = router;
