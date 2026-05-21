import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import {
  isSuperAdminRole,
  resolveIsAdmin,
  resolveRole,
} from "@/lib/auth/resolve-role";

export type AdminActionContext = {
  supabase: Awaited<ReturnType<typeof createClient>>;
  service: Awaited<ReturnType<typeof createServiceClient>>;
  user: User;
  role: string;
  isSuperAdmin: boolean;
};

async function loadAdminUser(): Promise<AdminActionContext | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = resolveRole(user, profile?.role);
  if (!resolveIsAdmin(user, profile?.role)) return null;

  const service = await createServiceClient();
  return {
    supabase,
    service,
    user,
    role,
    isSuperAdmin: isSuperAdminRole(role),
  };
}

async function requireAdminUser() {
  const ctx = await loadAdminUser();
  if (!ctx) {
    redirect("/login?redirect=/admin");
  }
  return ctx;
}

/** Cached per request — auth once, reuse service client for all admin reads/writes. */
export const getAdminContext = cache(async () => {
  return requireAdminUser();
});

/** Authenticated admin session + service-role client (bypasses RLS). */
export async function getAdminServiceClient() {
  const { service } = await getAdminContext();
  return service;
}

/** For server actions: any admin-panel role. */
export async function getAdminActionContext(): Promise<AdminActionContext> {
  const ctx = await loadAdminUser();
  if (!ctx) {
    throw new Error("Not authenticated");
  }
  return ctx;
}

/** For server actions: super admin only. */
export async function getSuperAdminActionContext(): Promise<AdminActionContext> {
  const ctx = await getAdminActionContext();
  if (!ctx.isSuperAdmin) {
    throw new Error("Super admin access required");
  }
  return ctx;
}
