import { RequestHandler } from "express";
import { getDbPool } from "../database";

export const getDashboard: RequestHandler = async (_req, res) => {
  try {
    const pool = await getDbPool();

    // Get menu data
    const menuResult = await pool.request().query(`
      SELECT * FROM MenuItems
    `);

    // Get feedback data
    const feedbackResult = await pool.request().query(`
      SELECT * FROM Feedback
    `);

    const menuItems = menuResult.recordset;
    const feedbackItems = feedbackResult.recordset;

    // Calculations
    const totalPrepared = menuItems.reduce(
      (sum: number, item: any) => sum + Number(item.QuantityPrepared || 0),
      0
    );

    const totalFeedback = feedbackItems.length;

    const averageRating =
      totalFeedback > 0
        ? (
            feedbackItems.reduce(
              (sum: number, item: any) => sum + Number(item.Rating || 0),
              0
            ) / totalFeedback
          ).toFixed(1)
        : "0.0";

    // Find most popular dish
    const dishMap: Record<string, number> = {};

    menuItems.forEach((item: any) => {
      dishMap[item.DishName] =
        (dishMap[item.DishName] || 0) + Number(item.QuantityPrepared || 0);
    });

    let popularMeal = "No data";
    let maxQty = 0;

    Object.entries(dishMap).forEach(([dish, qty]) => {
      if (qty > maxQty) {
        maxQty = qty as number;
        popularMeal = dish;
      }
    });

    // Simple NutriCast logic
    const alerts: string[] = [];

    if (totalPrepared > 1000) {
      alerts.push("High food preparation detected. Monitor waste closely.");
    }

    if (Number(averageRating) < 3.5 && totalFeedback > 0) {
      alerts.push("Low average rating. Consider improving menu quality.");
    }

    if (menuItems.length === 0) {
      alerts.push("No menu items added yet.");
    }

    if (feedbackItems.length === 0) {
      alerts.push("No feedback data available.");
    }

    res.status(200).json({
      totalPrepared,
      totalFeedback,
      averageRating,
      popularMeal,
      alerts,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({
      message: "Error loading dashboard",
      error: err instanceof Error ? err.message : String(err),
    });
  }
};