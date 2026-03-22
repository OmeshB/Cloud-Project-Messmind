import { RequestHandler } from "express";
import { getDbPool } from "../database";

export const getFeedback: RequestHandler = async (_req, res) => {
  try {
    const pool = await getDbPool();
    const result = await pool.request().query(`
      SELECT * FROM Feedback ORDER BY CreatedAt DESC
    `);

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error fetching feedback:", err);
    res.status(500).json({
      message: "Error fetching feedback",
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export const addFeedback: RequestHandler = async (req, res) => {
  try {
    const { studentName, dishName, rating, comment } = req.body;

    const pool = await getDbPool();
    await pool
      .request()
      .input("StudentName", studentName)
      .input("DishName", dishName)
      .input("Rating", Number(rating))
      .input("Comment", comment)
      .query(`
        INSERT INTO Feedback (StudentName, DishName, Rating, Comment)
        VALUES (@StudentName, @DishName, @Rating, @Comment)
      `);

    res.status(201).json({ message: "Feedback added successfully" });
  } catch (err) {
    console.error("Error adding feedback:", err);
    res.status(500).json({
      message: "Error adding feedback",
      error: err instanceof Error ? err.message : String(err),
    });
  }
};