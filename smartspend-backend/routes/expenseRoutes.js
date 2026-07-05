const express = require("express");
const { addExpense, getExpenses, updateExpense, deleteExpense } = require("../controllers/expenseController");
const { requireSignIn } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { expenseValidator, dateRangeValidator } = require("../validators/transactionValidator");

const router = express.Router();

router.post("/add", requireSignIn, expenseValidator, validate, addExpense);
router.get("/", requireSignIn, dateRangeValidator, validate, getExpenses);
router.put("/:id", requireSignIn, updateExpense);
router.delete("/:id", requireSignIn, deleteExpense);

module.exports = router;
