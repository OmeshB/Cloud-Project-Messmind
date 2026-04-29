import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import { handleDemo } from "./routes/demo";
import { getMenu, addMenu } from "./routes/menu";
import { getFeedback, addFeedback } from "./routes/feedback";
import { getDashboard } from "./routes/dashboard";
import predictionRoutes from "./routes/prediction";
import uploadRouter from "./routes/upload";

export function createServer() {
  const app = express();

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later.",
  });

  app.use(limiter);

  const corsOptions = {
    origin: [
      "https://proud-sand-0b0709500.7.azurestaticapps.net",
      "https://messmind-app-cqb9gkagg7exgrcf.centralindia-01.azurewebsites.net",
      "http://localhost:3000",
      "http://localhost:8080",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  };

  app.use(cors(corsOptions));
  app.options(/.*/, cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api", uploadRouter);

  app.get("/api/ping", (_req, res) => {
    res.json({ message: "ping" });
  });

  // ✅ NEW: Metrics endpoint (for monitoring demo)
  app.get("/api/metrics", (_req, res) => {
    res.json({
      requests: Math.floor(Math.random() * 100),
      errors: Math.floor(Math.random() * 10),
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  app.get("/api/demo", handleDemo);

  app.get("/api/menu", getMenu);
  app.post("/api/menu", addMenu);

  app.get("/api/feedback", getFeedback);
  app.post("/api/feedback", addFeedback);

  app.get("/api/dashboard", getDashboard);

  app.use("/api/prediction", predictionRoutes);

  return app;
}

const app = createServer();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});