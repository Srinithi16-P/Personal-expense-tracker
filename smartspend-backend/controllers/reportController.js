const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const mongoose = require("mongoose");
const Income = require("../models/incomeModel");
const Expense = require("../models/expenseModel");

const getMonthRange = (req) => {
  const now = new Date();
  const month = Number(req.query.month) || now.getMonth() + 1;
  const year = Number(req.query.year) || now.getFullYear();
  return {
    month,
    year,
    start: new Date(year, month - 1, 1),
    end: new Date(year, month, 1),
  };
};

const monthlyReportJSON = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const { month, year, start, end } = getMonthRange(req);

    const [incomes, expenses] = await Promise.all([
      Income.find({ user: userId, date: { $gte: start, $lt: end } }).sort({ date: 1 }),
      Expense.find({ user: userId, date: { $gte: start, $lt: end } }).sort({ date: 1 }),
    ]);

    const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
    const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);

    res.status(200).json({
      success: true,
      month,
      year,
      totalIncome,
      totalExpense,
      savings: totalIncome - totalExpense,
      incomes,
      expenses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to build report." });
  }
};

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const ACCENT = "#1FD67A";
const INK = "#111827";
const MUTED = "#6B7280";
const BORDER = "#E5E7EB";
const ROW_ALT = "#F9FAFB";

const downloadPDFReport = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const { month, year, start, end } = getMonthRange(req);

    const [incomes, expenses] = await Promise.all([
      Income.find({ user: userId, date: { $gte: start, $lt: end } }).sort({ date: 1 }),
      Expense.find({ user: userId, date: { $gte: start, $lt: end } }).sort({ date: 1 }),
    ]);

    const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
    const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
    const netSavings = totalIncome - totalExpense;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=SmartSpend_Report_${month}_${year}.pdf`);

    const doc = new PDFDocument({ size: "A4", margin: 0 });
    doc.pipe(res);

    const pageWidth = doc.page.width;
    const marginX = 48;
    const contentWidth = pageWidth - marginX * 2;

    
    doc.rect(0, 0, pageWidth, 110).fill(ACCENT);
    doc.fillColor("#062017").font("Helvetica-Bold").fontSize(22).text("SmartSpend", marginX, 34);
    doc.font("Helvetica").fontSize(11).fillColor("#0B3D2A").text("Monthly Financial Report", marginX, 62);
    doc.fontSize(10).fillColor("#0B3D2A").text(`${MONTH_NAMES[month - 1]} ${year}`, marginX, 80);

    doc.fillColor("#062017").font("Helvetica").fontSize(9)
      .text(req.user.name, pageWidth - marginX - 200, 40, { width: 200, align: "right" })
      .text(req.user.email, pageWidth - marginX - 200, 54, { width: 200, align: "right" });

    let y = 140;

    // ---- Summary cards ----
    const cardWidth = (contentWidth - 24) / 3;
    const cards = [
      { label: "Total Income", value: totalIncome, color: "#0F9856" },
      { label: "Total Expense", value: totalExpense, color: "#DC2626" },
      { label: "Net Savings", value: netSavings, color: netSavings >= 0 ? "#0F9856" : "#DC2626" },
    ];
    cards.forEach((card, i) => {
      const x = marginX + i * (cardWidth + 12);
      doc.roundedRect(x, y, cardWidth, 64, 8).fillAndStroke("#FFFFFF", BORDER);
      doc.fillColor(MUTED).font("Helvetica").fontSize(9).text(card.label, x + 14, y + 12);
      doc.fillColor(card.color).font("Helvetica-Bold").fontSize(17).text(`Rs. ${card.value.toLocaleString()}`, x + 14, y + 30);
    });
    y += 64 + 30;

    const drawSectionHeader = (title) => {
      doc.fillColor(INK).font("Helvetica-Bold").fontSize(13).text(title, marginX, y);
      y += 20;
      doc.moveTo(marginX, y).lineTo(pageWidth - marginX, y).strokeColor(BORDER).lineWidth(1).stroke();
      y += 10;
    };

    const drawTable = (rows, columns) => {
      const colWidths = columns.map((c) => c.width);
      
      doc.font("Helvetica-Bold").fontSize(9).fillColor(MUTED);
      let x = marginX;
      columns.forEach((c, i) => {
        doc.text(c.label, x, y, { width: colWidths[i], align: c.align || "left" });
        x += colWidths[i];
      });
      y += 16;
      doc.moveTo(marginX, y).lineTo(pageWidth - marginX, y).strokeColor(BORDER).stroke();
      y += 4;

      doc.font("Helvetica").fontSize(9.5);
      rows.forEach((row, idx) => {
        if (y > doc.page.height - 80) {
          doc.addPage();
          y = 48;
        }
        if (idx % 2 === 0) {
          doc.rect(marginX, y, contentWidth, 20).fill(ROW_ALT);
        }
        doc.fillColor(INK);
        x = marginX;
        columns.forEach((c, i) => {
          doc.text(String(row[c.key] ?? ""), x + 6, y + 5, { width: colWidths[i] - 6, align: c.align || "left" });
          x += colWidths[i];
        });
        y += 20;
      });
      y += 20;
    };

    if (expenses.length > 0) {
      drawSectionHeader("Expenses");
      drawTable(
        expenses.map((e) => ({
          date: e.date.toISOString().slice(0, 10),
          category: e.category,
          amount: `Rs. ${e.amount.toLocaleString()}`,
          method: e.paymentMethod.toUpperCase(),
          notes: e.notes || "-",
        })),
        [
          { key: "date", label: "Date", width: 75 },
          { key: "category", label: "Category", width: 90 },
          { key: "amount", label: "Amount", width: 80, align: "right" },
          { key: "method", label: "Method", width: 70 },
          { key: "notes", label: "Notes", width: contentWidth - 75 - 90 - 80 - 70 },
        ]
      );
    } else {
      doc.fillColor(MUTED).font("Helvetica").fontSize(10).text("No expenses recorded this month.", marginX, y);
      y += 30;
    }

    if (incomes.length > 0) {
      drawSectionHeader("Income");
      drawTable(
        incomes.map((i) => ({
          date: i.date.toISOString().slice(0, 10),
          source: i.source,
          amount: `Rs. ${i.amount.toLocaleString()}`,
          notes: i.notes || "-",
        })),
        [
          { key: "date", label: "Date", width: 90 },
          { key: "source", label: "Source", width: 130 },
          { key: "amount", label: "Amount", width: 100, align: "right" },
          { key: "notes", label: "Notes", width: contentWidth - 90 - 130 - 100 },
        ]
      );
    } else {
      doc.fillColor(MUTED).font("Helvetica").fontSize(10).text("No income recorded this month.", marginX, y);
    }

    // ---- Footer ----
    doc.fontSize(8).fillColor(MUTED).text(
      `Generated by SmartSpend on ${new Date().toISOString().slice(0, 10)}`,
      marginX,
      doc.page.height - 40,
      { width: contentWidth, align: "center" }
    );

    doc.end();
  } catch (error) {
    console.error("PDF Report Error:", error);
    res.status(500).json({ success: false, message: "Failed to generate PDF report." });
  }
};

const downloadExcelReport = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const { month, year, start, end } = getMonthRange(req);

    const [incomes, expenses] = await Promise.all([
      Income.find({ user: userId, date: { $gte: start, $lt: end } }).sort({ date: 1 }),
      Expense.find({ user: userId, date: { $gte: start, $lt: end } }).sort({ date: 1 }),
    ]);

    const workbook = new ExcelJS.Workbook();

    const expenseSheet = workbook.addWorksheet("Expenses");
    expenseSheet.columns = [
      { header: "Date", key: "date", width: 15 },
      { header: "Category", key: "category", width: 20 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Payment Method", key: "paymentMethod", width: 18 },
      { header: "Notes", key: "notes", width: 30 },
    ];
    expenses.forEach((e) =>
      expenseSheet.addRow({
        date: e.date.toISOString().slice(0, 10),
        category: e.category,
        amount: e.amount,
        paymentMethod: e.paymentMethod,
        notes: e.notes,
      })
    );

    const incomeSheet = workbook.addWorksheet("Income");
    incomeSheet.columns = [
      { header: "Date", key: "date", width: 15 },
      { header: "Source", key: "source", width: 20 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Notes", key: "notes", width: 30 },
    ];
    incomes.forEach((i) =>
      incomeSheet.addRow({ date: i.date.toISOString().slice(0, 10), source: i.source, amount: i.amount, notes: i.notes })
    );

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=SmartSpend_Report_${month}_${year}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Excel Report Error:", error);
    res.status(500).json({ success: false, message: "Failed to generate Excel report." });
  }
};

module.exports = { monthlyReportJSON, downloadPDFReport, downloadExcelReport };
