import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { movementRelations, movements } from "../../domain/entities/Movement.entity";
import { categories } from "../../domain/entities/Category.entity";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: { rejectUnauthorized: false },
});

export const db = drizzle(pool, {
  schema: {
    movements,
    categories,
    movementRelations,
  },
});
