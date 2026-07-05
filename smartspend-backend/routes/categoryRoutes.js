const express = require("express");
const { getCategories, addCategory, deleteCategory } = require("../controllers/categoryController");
const { requireSignIn } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { categoryValidator } = require("../validators/transactionValidator");

const router = express.Router();

router.get("/", requireSignIn, getCategories);
router.post("/", requireSignIn, categoryValidator, validate, addCategory);
router.delete("/:id", requireSignIn, deleteCategory);

module.exports = router;
