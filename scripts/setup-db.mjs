import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.log(`
DATABASE_URL is not set in .env.local

1. Open Supabase Dashboard → Project Settings → Database
2. Copy the "Connection string" (URI) — use the pooler (port 6543) or direct (5432)
3. Add to .env.local: DATABASE_URL=postgresql://...
4. Run: npm run db:setup

Or paste supabase/migrations/20240518000000_initial_schema.sql
and supabase/seed.sql into the SQL Editor:
https://supabase.com/dashboard/project/zogsfwrcpriugtetdtmd/sql/new
Then run: npm run db:seed
`);
    process.exit(1);
  }

  const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
  await client.connect();

  const migration = readFileSync(
    join(root, "supabase/migrations/20240518000000_initial_schema.sql"),
    "utf8"
  );
  const seed = readFileSync(join(root, "supabase/seed.sql"), "utf8");

  console.log("Applying schema...");
  await client.query(migration);
  console.log("Applying seed...");
  await client.query(seed);
  await client.end();
  console.log("Database ready.");
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
