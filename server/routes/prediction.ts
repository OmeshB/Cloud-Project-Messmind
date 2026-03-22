import { RequestHandler } from "express";
import { getDbPool } from "../database";

export const getPrediction: RequestHandler = async (_req, res) => {
  try {
    const pool = await getDbPool();

    const menuResult = await pool.request().query(`
      SELECT * FROM MenuItems
    `);

    const menuItems = menuResult.recordset;

    if (menuItems.length === 0) {
      return res.status(200).json({
        predictedDemand: 0,
        topDish: "No data",
        lowDemandDishes: [],
        suggestion: "Add menu data to generate NutriCast predictions.",
      });
    }

    const totalPrepared = menuItems.reduce(
      (sum: number, item: any) => sum + Number(item.QuantityPrepared || 0),
      0
    );

    const averageDemand = Math.round(totalPrepared / menuItems.length);

    const dishMap: Record<string, number> = {};

    menuItems.forEach((item: any) => {
      dishMap[item.DishName] =
        (dishMap[item.DishName] || 0) + Number(item.QuantityPrepared || 0);
    });

    let topDish = "No data";
    let maxQty = 0;

    Object.entries(dishMap).forEach(([dish, qty]) => {
      if (Number(qty) > maxQty) {
        maxQty = Number(qty);
        topDish = dish;
      }
    });

    const lowDemandDishes = Object.entries(dishMap)
      .filter(([, qty]) => Number(qty) < averageDemand)
      .map(([dish, qty]) => ({
        dish,
        quantity: qty,
      }));

    let suggestion = `Prepare around ${averageDemand} portions based on current trend.`;

    if (lowDemandDishes.length > 0) {
      suggestion = `Reduce preparation for ${lowDemandDishes[0].dish} and focus more on ${topDish}.`;
    }

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
};