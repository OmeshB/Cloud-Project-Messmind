import { RequestHandler } from "express";
import { getDbPool } from "../database";

export const getMenu: RequestHandler = async (_req, res) => {
  try {
    const pool = await getDbPool();
    const result = await pool.request().query(`
      SELECT * FROM MenuItems ORDER BY MealDate DESC
    `);

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error fetching menu:", err);
    res.status(500).json({
      message: "Error fetching menu",
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export const addMenu: RequestHandler = async (req, res) => {
  try {
    const { date, mealType, dishName, quantityPrepared } = req.body;

    const pool = await getDbPool();
    await pool
      .request()
      .input("MealDate", date)
      .input("MealType", mealType)
      .input("DishName", dishName)
      .input("QuantityPrepared", Number(quantityPrepared))
      .query(`
        INSERT INTO MenuItems (MealDate, MealType, DishName, QuantityPrepared)
        VALUES (@MealDate, @MealType, @DishName, @QuantityPrepared)
      `);

    res.status(201).json({ message: "Menu added successfully" });
  } catch (err) {
    console.error("Error adding menu:", err);
    res.status(500).json({
      message: "Error adding menu",
      error: err instanceof Error ? err.message : String(err),
    });
  }
};