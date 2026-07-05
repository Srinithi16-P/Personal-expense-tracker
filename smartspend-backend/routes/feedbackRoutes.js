const express = require("express");
const { submitFeedback, getMyFeedback } = require("../controllers/feedbackController");
const { requireSignIn } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { feedbackValidator } = require("../validators/transactionValidator");

const router = express.Router();

router.post("/", requireSignIn, feedbackValidator, validate, submitFeedback);
router.get("/", requireSignIn, getMyFeedback);

module.exports = router;
