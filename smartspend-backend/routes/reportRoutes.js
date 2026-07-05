const express = require("express");
const { monthlyReportJSON, downloadPDFReport, downloadExcelReport } = require("../controllers/reportController");
const { requireSignIn } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/monthly", requireSignIn, monthlyReportJSON);
router.get("/download/pdf", requireSignIn, downloadPDFReport);
router.get("/download/excel", requireSignIn, downloadExcelReport);

module.exports = router;
