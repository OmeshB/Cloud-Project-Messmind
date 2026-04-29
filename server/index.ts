import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit"; // ✅ ADD THIS

import { handleDemo } from "./routes/demo";
import { getMenu, addMenu } from "./routes/menu";
import { getFeedback, addFeedback } from "./routes/feedback";
import { getDashboard } from "./routes/dashboard";
import predictionRoutes from "./routes/prediction";
import uploadRouter from "./routes/upload";

export function createServer() {
  const app = express();

  // ✅ ADD RATE LIMITER HERE
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests
    message: "Too many requests, please try again later.",
  });

  app.use(limiter); // ✅ APPLY GLOBALLY

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