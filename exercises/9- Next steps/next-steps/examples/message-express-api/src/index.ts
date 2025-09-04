import express from "express";
import cors from "cors";
import { wallRoutes } from "./routes/wall.route";
import { requestLogger } from "./middleware/request-logger.middleware";
import { authRoutes } from "./routes/auth.route";
import cookieParser from "cookie-parser";
// import { messageRoutes } from "./routes/message.route";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(cookieParser("secret"));

// Routes
app.use("/api/walls", wallRoutes);
app.use("/api/auth", authRoutes);

// app.use("/api/messages", messageRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  process.exit(0);
});
