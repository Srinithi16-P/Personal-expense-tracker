const { body } = require("express-validator");

const registerValidator = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required.")
    .isLength({ min: 2, max: 50 }).withMessage("Name must be 2-50 characters.")
    .matches(/^[a-zA-Z\s]+$/).withMessage("Name must contain only letters and spaces."),
  body("email").trim().notEmpty().withMessage("Email is required.").isEmail().withMessage("Enter a valid email address."),
  body("password")
    .notEmpty().withMessage("Password is required.")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters.")
    .matches(/[A-Z]/).withMessage("Password must contain an uppercase letter.")
    .matches(/[a-z]/).withMessage("Password must contain a lowercase letter.")
    .matches(/[0-9]/).withMessage("Password must contain a number.")
    .matches(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/).withMessage("Password must contain a special character."),
  body("monthlyIncome").optional().isFloat({ min: 0 }).withMessage("Monthly income cannot be negative."),
  body("currency").optional().isString().trim().isLength({ min: 3, max: 3 }).withMessage("Currency must be a 3-letter code (e.g. INR)."),
];

const loginValidator = [
  body("email").trim().notEmpty().withMessage("Email is required.").isEmail().withMessage("Enter a valid email address."),
  body("password").notEmpty().withMessage("Password is required."),
];

const forgotPasswordValidator = [
  body("email").trim().notEmpty().withMessage("Email is required.").isEmail().withMessage("Enter a valid email address."),
];

const resetPasswordValidator = [
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters."),
  body("confirmPassword").custom((value, { req }) => value === req.body.password).withMessage("Passwords do not match."),
];

const changePasswordValidator = [
  body("currentPassword").notEmpty().withMessage("Current password is required."),
  body("newPassword").isLength({ min: 8 }).withMessage("New password must be at least 8 characters."),
];

module.exports = { registerValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator, changePasswordValidator };
