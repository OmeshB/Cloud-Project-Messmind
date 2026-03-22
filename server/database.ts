import "dotenv/config";
import sql from "mssql";

const dbConfig: sql.config = {
  server: process.env.DB_SERVER || "",
  database: process.env.DB_DATABASE || "",
  user: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  port: Number(process.env.DB_PORT || 1433),
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

let pool: sql.ConnectionPool | null = null;

export async function getDbPool() {
  if (pool) return pool;

  pool = await sql.connect(dbConfig);
  console.log("Connected to Azure SQL Database");
  return pool;
}