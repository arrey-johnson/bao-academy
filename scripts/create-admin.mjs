/**
 * Create or update a Supabase auth user and set profiles.role = 'admin'.
 *
 * Usage:
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='secret' node scripts/create-admin.mjs
 *   ADMIN_NAME='Full Name' (optional)
 */
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const fullName = process.env.ADMIN_NAME ?? email?.split("@")[0] ?? "Admin";

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}
if (!email || !password) {
  console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD env vars.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: list, error: listErr } = await supabase.auth.admin.listUsers({
  perPage: 1000,
});
if (listErr) throw listErr;

const existing = list.users.find(
  (u) => u.email?.toLowerCase() === email.toLowerCase()
);

let userId;

if (existing) {
  userId = existing.id;
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    password,
    email_confirm: true,
        user_metadata: { full_name: fullName, role: "admin" },
        app_metadata: { role: "admin" },
  });
  if (error) throw error;
  console.log("Updated auth user:", userId);
} else {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
        user_metadata: { full_name: fullName, role: "admin" },
        app_metadata: { role: "admin" },
  });
  if (error) throw error;
  userId = data.user.id;
  console.log("Created auth user:", userId);
}

const { error: profileErr } = await supabase
  .from("profiles")
  .update({ role: "admin", full_name: fullName, email })
  .eq("id", userId);

if (profileErr) {
  if (profileErr.code === "PGRST205") {
    console.error(`
profiles table not found — apply the database schema first:

1. Open https://supabase.com/dashboard/project/zogsfwrcpriugtetdtmd/sql/new
2. Paste and run: supabase/full-setup.sql
3. Re-run this script

Auth user already exists (${userId}). After schema is applied, run in SQL Editor:

  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES ('${userId}', '${email}', '${fullName}', 'admin')
  ON CONFLICT (id) DO UPDATE SET role = 'admin', full_name = EXCLUDED.full_name;
`);
    process.exit(1);
  }
  throw profileErr;
}

console.log("Admin profile ready. Sign in at /login");
console.log("  email:", email);
console.log("  role: admin");
