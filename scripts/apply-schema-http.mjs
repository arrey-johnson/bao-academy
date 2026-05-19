/**
 * Attempts to apply schema via Supabase HTTP (fallback when DATABASE_URL missing).
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const ref = "zogsfwrcpriugtetdtmd";
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const sql = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../supabase/migrations/20240518000000_initial_schema.sql"),
  "utf8"
);

const endpoints = [
  `https://${ref}.supabase.co/pg/query`,
  `https://api.supabase.com/v1/projects/${ref}/database/query`,
];

for (const url of endpoints) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: "SELECT 1" }),
  });
  console.log(url, res.status, await res.text().then((t) => t.slice(0, 80)));
}

console.log("\nIf all failed, use SQL Editor or npm run db:setup with DATABASE_URL");
