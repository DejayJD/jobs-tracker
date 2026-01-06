import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";
import { config } from "dotenv";
import { resolve } from "path";

// Load .env first, then .env.local (which will override .env values)
config(); // Load .env
config({ path: resolve(process.cwd(), ".env.local"), override: true }); // Override with .env.local

// Neon serverless driver (recommended by Vercel for Neon Postgres)
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

export * from "./schema";
