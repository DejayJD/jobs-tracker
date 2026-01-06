import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load .env first, then .env.local (which will override .env values)
dotenv.config();
dotenv.config({ path: resolve(process.cwd(), ".env.local"), override: true });

// Support Neon Postgres connection string (works with both Vercel env vars and local .env.local)
// Priority: POSTGRES_URL_NON_POOLING > POSTGRES_URL > DATABASE_URL
const connectionUrl =
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL;

const config: Config = {
  schema: "./server/db/schema.ts",
  out: "./server/db/migrations",
  dialect: "postgresql",
  dbCredentials: connectionUrl
    ? {
        // Use connection string (for Vercel Postgres or other providers)
        url: connectionUrl,
      }
    : {
        // Fall back to individual connection parameters (for local development)
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "5432"),
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "postgres",
        database: process.env.DB_NAME || "jobs_tracker",
      },
};

export default config;
