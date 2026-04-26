import { getDbPool } from "../database";

export async function getMenuFromDB() {
  const pool = await getDbPool();

  if (!pool) {
    console.error("DB not connected, returning empty data");
    return [];
  }

  try {
    const result = await pool.request().query(`
      SELECT DishName, QuantityPrepared FROM MenuItems
    `);

    return result.recordset;
  } catch (err) {
    console.error("❌ Table issue, using fallback data:", err);

    // fallback (so app never crashes)
    return [
      { DishName: "Rice", QuantityPrepared: 120 },
      { DishName: "Dosa", QuantityPrepared: 80 },
      { DishName: "Meals", QuantityPrepared: 150 },
    ];
  }
}