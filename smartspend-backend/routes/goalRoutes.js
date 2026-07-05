const express = require("express");
const { createGoal, getGoals, updateGoal, deleteGoal } = require("../controllers/goalController");
const { requireSignIn } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { goalValidator } = require("../validators/transactionValidator");

const router = express.Router();

router.post("/create", requireSignIn, goalValidator, validate, createGoal);
router.get("/", requireSignIn, getGoals);
router.put("/:id", requireSignIn, updateGoal);
router.delete("/:id", requireSignIn, deleteGoal);

module.exports = router;
