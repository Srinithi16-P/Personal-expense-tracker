const express = require("express");
const { addIncome, getIncomes, updateIncome, deleteIncome } = require("../controllers/incomeController");
const { requireSignIn } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { incomeValidator, dateRangeValidator } = require("../validators/transactionValidator");

const router = express.Router();

router.post("/add", requireSignIn, incomeValidator, validate, addIncome);
router.get("/", requireSignIn, dateRangeValidator, validate, getIncomes);
router.put("/:id", requireSignIn, updateIncome);
router.delete("/:id", requireSignIn, deleteIncome);

module.exports = router;
