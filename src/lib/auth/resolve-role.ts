import type { User } from "@supabase/supabase-js";
import { isAdminRole } from "@/lib/auth/roles";

/** Fallback when profiles table is missing or not synced yet. */
const BUILTIN_ADMIN_EMAILS = [
  "arrey.johnson@baotechnologiesandtravels.com",
];

function getAdminEmailAllowlist(): string[] {
  const fromEnv =
    process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? process.env.ADMIN_EMAILS ?? "";
  const parsed = fromEnv
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return [...new Set([...parsed, ...BUILTIN_ADMIN_EMAILS])];
}

/**
 * Resolve role from profile row, auth metadata, or admin email allowlist.
 */
export function resolveRole(
  user: User | null | undefined,
  profileRole?: string | null
): string {
  if (profileRole) return profileRole;
  if (!user) return "student";

  const metaRole = user.user_metadata?.role;
  if (typeof metaRole === "string" && metaRole) return metaRole;

  const appRole = (user as User & { app_metadata?: { role?: string } })
    .app_metadata?.role;
  if (typeof appRole === "string" && appRole) return appRole;

  const email = user.email?.toLowerCase();
  if (email && getAdminEmailAllowlist().includes(email)) {
    return "admin";
  }

  return "student";
}

export function resolveIsAdmin(
  user: User | null | undefined,
  profileRole?: string | null
): boolean {
  return isAdminRole(resolveRole(user, profileRole));
}
