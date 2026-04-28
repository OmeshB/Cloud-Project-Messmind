import express from "express";
import { getAIInsight } from "../services/aiService";
import { moderateText } from "../services/moderationService";
import { getMenuFromDB } from "../services/menuService";

const router = express.Router();

// ✅ MAIN GET ROUTE
router.get("/", async (_req, res) => {
  try {
    const menuItems = await getMenuFromDB();

    if (!menuItems.length) {
      return res.status(200).json({
        predictedDemand: 0,
        topDish: "No data",
        lowDemandDishes: [],
        suggestion: "No menu data available",
      });
    }

    const totalPrepared = menuItems.reduce(
      (sum, item) => sum + Number(item.QuantityPrepared || 0),
      0
    );

    const averageDemand = Math.round(totalPrepared / menuItems.length);

    // 🔥 Find top dish dynamically
    const topItem = menuItems.reduce((prev, curr) =>
      curr.QuantityPrepared > prev.QuantityPrepared ? curr : prev
    );

    const topDish = topItem.DishName;

    // 🔥 Find low demand dish
    const lowItem = menuItems.reduce((prev, curr) =>
      curr.QuantityPrepared < prev.QuantityPrepared ? curr : prev
    );

    const lowDemandDishes = [
      { dish: lowItem.DishName, quantity: lowItem.QuantityPrepared },
    ];

    const suggestion = `Prepare around ${averageDemand} portions. Focus more on ${topDish}.`;

    res.status(200).json({
      predictedDemand: averageDemand,
      topDish,
      lowDemandDishes,
      suggestion,
    });
  } catch (err) {
    console.error("Prediction error:", err);
    res.status(500).json({
      message: "Error generating prediction",
      error: err instanceof Error ? err.message : String(err),
    });
  }
});

// 🔥 HEALTH / DEBUG ROUTE
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    geminiKeyExists: !!process.env.GEMINI_API_KEY,
    groqKeyExists: !!process.env.GROQ_API_KEY,
    version: "1.0.1"
  });
});

// 🔥 AI ROUTE
router.post("/ai-insight", async (req, res) => {
  try {
    const data = req.body;

    const rawInsight = await getAIInsight(data);

    // ✅ SAFETY: handle empty/invalid AI response
    if (!rawInsight || typeof rawInsight !== "string") {
      return res.json({
        insight: "⚠️ AI could not generate insight. Try again.",
      });
    }

    const moderation = await moderateText(rawInsight);

    let finalInsight = rawInsight;

    if (moderation?.categoriesAnalysis) {
      const isUnsafe = moderation.categoriesAnalysis.some(
        (c: any) => c.severity >= 3
      );

      if (isUnsafe) {
        finalInsight =
          "⚠️ AI insight was filtered due to safety concerns.";
      }
    }

    // ✅ ALWAYS return valid JSON
    res.json({ insight: finalInsight });

  } catch (err) {
    console.error("AI Insight error:", err);

    // ✅ NEVER send empty response
    res.json({
      insight: "⚠️ AI service failed. Please try again later.",
    });
  }
});

export default router;