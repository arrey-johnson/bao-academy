import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error(
      "Missing DATABASE_URL in .env.local\n" +
        "Get it from Supabase Dashboard → Project Settings → Database → Connection string (URI)\n" +
        "Then run: npm run db:migrate"
    );
    process.exit(1);
  }

  const client = new pg.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();

  const migrationPath = join(
    root,
    "supabase/migrations/20240518000000_initial_schema.sql"
  );
  const sql = readFileSync(migrationPath, "utf8");

  console.log("Applying schema migration...");
  await client.query(sql);
  console.log("Schema applied.");

  const seedPath = join(root, "supabase/seed.sql");
  const seedSql = readFileSync(seedPath, "utf8");
  console.log("Applying seed...");
  await client.query(seedSql);
  console.log("Seed applied.");

  await client.end();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
