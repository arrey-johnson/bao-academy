import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicEnv, type SupabasePublicEnv } from "@/lib/supabase/env";

export type { SupabasePublicEnv };

/** Browser Supabase client. Pass `env` from a Server Component when deploy env may differ from the build bundle. */
export function createClient(env?: SupabasePublicEnv | null) {
  const resolved = env ?? getSupabasePublicEnv();
  if (!resolved) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY on Vercel, then redeploy."
    );
  }

  return createBrowserClient(resolved.url, resolved.anonKey);
}
