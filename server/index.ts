import "dotenv/config";
import express from "express";
import cors from "cors";

import { handleDemo } from "./routes/demo";
import { getMenu, addMenu } from "./routes/menu";
import { getFeedback, addFeedback } from "./routes/feedback";
import { getDashboard } from "./routes/dashboard";
import predictionRoutes from "./routes/prediction";
import uploadRouter from "./routes/upload";

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ✅ FIX: cleaner route handling
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