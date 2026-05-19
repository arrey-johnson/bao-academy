import { NextResponse } from "next/server";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

/** Quick check for Vercel / Supabase wiring (no secrets returned). */
export async function GET() {
  const env = getSupabasePublicEnv();
  return NextResponse.json({
    ok: Boolean(env),
    supabase: env
      ? { url: env.url, anonKeySet: env.anonKey.length > 20 }
      : null,
    serviceRoleSet: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()),
  });
}
