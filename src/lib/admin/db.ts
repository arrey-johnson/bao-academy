import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { resolveIsAdmin } from "@/lib/auth/resolve-role";

/** Authenticated admin session + service-role client (bypasses RLS for admin reads/writes). */
export async function getAdminServiceClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!resolveIsAdmin(user, profile?.role)) {
    redirect("/dashboard");
  }

  return createServiceClient();
}
