const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const colors = require("colors");

dotenv.config();

const connectDB = require("./config/db");
const { initSocket } = require("./config/socket");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

connectDB();

const app = express();
const server = http.createServer(app); // Socket.IO needs the raw HTTP server, not the Express app
initSocket(server);

app.use(helmet());
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(mongoSanitize()); // strips $ and . from user input to block NoSQL injection

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}


const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use("/api", apiLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many auth attempts, please try again later." },
});
app.use("/api/auth", authLimiter);


app.get("/", (req, res) => res.send("SmartSpend Backend API is running"));
app.get("/health", (req, res) => res.status(200).json({ success: true, status: "ok", uptime: process.uptime() }));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/income", require("./routes/incomeRoutes"));
app.use("/api/expense", require("./routes/expenseRoutes"));
app.use("/api/budget", require("./routes/budgetRoutes"));
app.use("/api/goal", require("./routes/goalRoutes"));
app.use("/api/category", require("./routes/categoryRoutes"));
app.use("/api/notification", require("./routes/notificationRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/report", require("./routes/reportRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`SmartSpend server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`.bgCyan.white);
});

process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`.bgRed.white);
  server.close(() => process.exit(1));
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully".yellow);
  server.close(() => process.exit(0));
});
console.log("CLIENT_URL:", process.env.CLIENT_URL);
console.log("ADMIN_URL:", process.env.ADMIN_URL);