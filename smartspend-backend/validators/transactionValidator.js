const { body, query } = require("express-validator");

const incomeValidator = [
  body("source").trim().notEmpty().withMessage("Source is required."),
  body("amount").isFloat({ gt: 0 }).withMessage("Amount must be greater than 0."),
  body("date").optional({ checkFalsy: true }).isISO8601().withMessage("Date must be a valid date."),
];

const expenseValidator = [
  body("category").trim().notEmpty().withMessage("Category is required."),
  body("amount").isFloat({ gt: 0 }).withMessage("Amount must be greater than 0."),
  body("date").optional({ checkFalsy: true }).isISO8601().withMessage("Date must be a valid date."),
  body("paymentMethod").optional().isIn(["cash", "card", "upi", "other"]).withMessage("Invalid payment method."),
];

const budgetValidator = [
  body("category").trim().notEmpty().withMessage("Category is required."),
  body("limit").isFloat({ gt: 0 }).withMessage("Limit must be greater than 0."),
  body("month").isInt({ min: 1, max: 12 }).withMessage("Month must be between 1 and 12."),
  body("year").isInt({ min: 2020, max: 2100 }).withMessage("Enter a valid year."),
];

const goalValidator = [
  body("title").trim().notEmpty().withMessage("Title is required."),
  body("targetAmount").isFloat({ gt: 0 }).withMessage("Target amount must be greater than 0."),
  body("deadline").optional({ checkFalsy: true }).isISO8601().withMessage("Deadline must be a valid date."),
];

const categoryValidator = [
  body("name").trim().notEmpty().withMessage("Category name is required."),
  body("type").isIn(["income", "expense"]).withMessage("Type must be income or expense."),
];

const feedbackValidator = [
  body("message").trim().isLength({ min: 5 }).withMessage("Feedback must be at least 5 characters."),
];

const dateRangeValidator = [
  query("startDate").optional({ checkFalsy: true }).isISO8601().withMessage("startDate must be a valid date."),
  query("endDate").optional({ checkFalsy: true }).isISO8601().withMessage("endDate must be a valid date."),
];

module.exports = {
  incomeValidator,
  expenseValidator,
  budgetValidator,
  goalValidator,
  categoryValidator,
  feedbackValidator,
  dateRangeValidator,
};
