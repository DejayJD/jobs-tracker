import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";
import { config } from "dotenv";
import { resolve } from "path";

// Load .env first, then .env.local (which will override .env values)
config(); // Load .env
config({ path: resolve(process.cwd(), ".env.local"), override: true }); // Override with .env.local

// Support Neon Postgres connection string (works with both Vercel env vars and local .env.local)
// Priority: POSTGRES_URL_NON_POOLING > POSTGRES_URL > DATABASE_URL
const connectionUrl =
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL;

if (!connectionUrl) {
  throw new Error(
    "Database connection URL not found. Please set POSTGRES_URL_NON_POOLING, POSTGRES_URL, or DATABASE_URL in your environment variables."
  );
}

// Neon serverless driver (recommended by Vercel for Neon Postgres)
const sql = neon(connectionUrl);
export const db = drizzle(sql, { schema });

export * from "./schema";
