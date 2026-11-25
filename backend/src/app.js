
import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

// Public health endpoints.
app.use("/api/health", healthRoutes);

// Authentication endpoints.
app.use("/api/auth", authRoutes);

// User management endpoints.

app.use("/api/users", userRoutes);

// Handle unknown routes.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Central error handler.
app.use((error, req, res, next) => {
  console.error("Unhandled application error:", error);

  res.status(error.status || 500).json({
    success: false,
    message: error.status
      ? error.message
      : "Internal server error.",
  });
});

export default app;
