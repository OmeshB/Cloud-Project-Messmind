import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { getMenu, addMenu } from "./routes/menu";
import { getFeedback, addFeedback } from "./routes/feedback";
import { getDashboard } from "./routes/dashboard";
import { getPrediction } from "./routes/prediction";
import uploadRouter from "./routes/upload";

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/api/upload", uploadRouter);

  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  app.get("/api/menu", getMenu);
  app.post("/api/menu", addMenu);

  app.get("/api/feedback", getFeedback);
  app.post("/api/feedback", addFeedback);

  app.get("/api/dashboard", getDashboard);

  app.get("/api/prediction", getPrediction);

  return app;
}