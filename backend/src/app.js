
import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import healthRoutes from "./routes/health.routes.js";

const app = express();

// Security-related HTTP headers.
app.use(helmet());

// Development CORS configuration.
// We will restrict allowed origins when integrating the frontend.
app.use(cors());

// Parse incoming JSON request bodies.
app.use(express.json({ limit: "1mb" }));

// Basic API rate limiting.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

// Health endpoints.
app.use("/api/health", healthRoutes);

// Unknown routes.
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
    message: error.status ? error.message : "Internal server error.",
  });
});

export default app;
