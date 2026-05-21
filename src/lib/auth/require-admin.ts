import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSuperAdminRole } from "@/lib/auth/roles";
import { resolveIsAdmin, resolveRole } from "@/lib/auth/resolve-role";

export type AdminSession = {
  user: { id: string; email?: string | null };
  profile: {
    id: string;
    email: string;
    full_name: string;
    role: string;
  };
  role: string;
  isSuperAdmin: boolean;
};

async function loadAdminSession(): Promise<AdminSession | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  const role = resolveRole(user, profile?.role);

  if (!resolveIsAdmin(user, profile?.role)) {
    return null;
  }

  return {
    user,
    profile: profile ?? {
      id: user.id,
      email: user.email ?? "",
      full_name:
        (user.user_metadata?.full_name as string) ??
        user.email?.split("@")[0] ??
        "Admin",
      role,
    },
    role,
    isSuperAdmin: isSuperAdminRole(role),
  };
}

/** Any admin-panel role (super admin or course admin). */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await loadAdminSession();
  if (!session) {
    redirect("/login?redirect=/admin");
  }
  return session;
}

/** Super admin only — redirects course admins to students. */
export async function requireSuperAdmin(): Promise<AdminSession> {
  const session = await requireAdmin();
  if (!session.isSuperAdmin) {
    redirect("/admin/students");
  }
  return session;
}
