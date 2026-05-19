/**
 * Applies full-setup.sql using DATABASE_URL or prints SQL Editor link.
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sql = readFileSync(join(root, "supabase/full-setup.sql"), "utf8");

if (!process.env.DATABASE_URL) {
  console.log(`
Apply schema manually:

1. Open: https://supabase.com/dashboard/project/zogsfwrcpriugtetdtmd/sql/new
2. Paste contents of: supabase/full-setup.sql
3. Click Run

Or add DATABASE_URL to .env.local and re-run: node scripts/run-sql-supabase.mjs
`);
  process.exit(1);
}

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
await client.connect();
await client.query(sql);
await client.end();
console.log("Schema + seed applied successfully.");
