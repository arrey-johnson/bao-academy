import Link from "next/link";
import { Shield } from "lucide-react";
import { requireAdmin } from "@/lib/auth/require-admin";
import { AdminNav } from "@/components/admin/AdminNav";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireAdmin();

  return (
    <DashboardShell maxWidth="6xl" className="!px-0">
      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="admin-sidebar w-full shrink-0 md:sticky md:top-24 md:w-60 md:self-start">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-bao/20 text-bao-light">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-bao-light">
                Admin
              </p>
              <p className="text-sm font-medium text-[var(--foreground)]">
                {profile.full_name ?? "Administrator"}
              </p>
            </div>
          </div>
          <p className="mb-5 truncate text-xs text-muted">{profile.email}</p>
          <AdminNav />
          <Link
            href="/dashboard"
            className="mt-6 inline-flex text-sm text-secondary transition-colors hover:text-[var(--foreground)]"
          >
            ← Student view
          </Link>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </DashboardShell>
  );
}
