import pg from "pg";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const hosts = [
  "db.zogsfwrcpriugtetdtmd.supabase.co",
  "aws-0-us-east-1.pooler.supabase.com",
  "aws-0-eu-west-1.pooler.supabase.com",
  "aws-0-ap-southeast-1.pooler.supabase.com",
];

const passwords = [
  process.env.SUPABASE_DB_PASSWORD,
  process.env.DATABASE_URL,
].filter(Boolean);

if (process.env.DATABASE_URL) {
  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  try {
    await client.connect();
    const sql = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../supabase/migrations/20240518000000_initial_schema.sql"),
      "utf8"
    );
    await client.query(sql);
    await client.query(
      readFileSync(
        join(dirname(fileURLToPath(import.meta.url)), "../supabase/seed.sql"),
        "utf8"
      )
    );
    console.log("Applied via DATABASE_URL");
    await client.end();
    process.exit(0);
  } catch (e) {
    console.error("DATABASE_URL failed:", e.message);
  }
}

console.log("No DATABASE_URL — schema must be applied via Supabase SQL Editor.");
process.exit(1);
