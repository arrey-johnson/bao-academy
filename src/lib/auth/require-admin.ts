import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { resolveIsAdmin, resolveRole } from "@/lib/auth/resolve-role";

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  const role = resolveRole(user, profile?.role);

  if (!resolveIsAdmin(user, profile?.role)) {
    redirect("/dashboard");
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
  };
}
