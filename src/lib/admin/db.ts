import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { resolveIsAdmin } from "@/lib/auth/resolve-role";

async function requireAdminUser() {
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

  return { supabase, user };
}

/** Cached per request — auth once, reuse service client for all admin reads/writes. */
export const getAdminContext = cache(async () => {
  const { supabase, user } = await requireAdminUser();
  const service = await createServiceClient();
  return { supabase, service, user };
});

/** Authenticated admin session + service-role client (bypasses RLS). */
export async function getAdminServiceClient() {
  const { service } = await getAdminContext();
  return service;
}

/** For server actions: throws instead of redirecting. */
export async function getAdminActionContext(): Promise<{
  supabase: Awaited<ReturnType<typeof createClient>>;
  service: Awaited<ReturnType<typeof createServiceClient>>;
  user: User;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!resolveIsAdmin(user, profile?.role)) {
    throw new Error("Admin access required");
  }

  const service = await createServiceClient();
  return { supabase, service, user };
}
