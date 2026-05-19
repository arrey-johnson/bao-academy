import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { requireStudent } from "@/lib/student/require-student";
import { getLearnCourseSlug } from "@/lib/student/queries";
import { StudentNav } from "@/components/student/StudentNav";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, user } = await requireStudent();
  const learnHref = `/learn/${await getLearnCourseSlug(user.id)}`;

  return (
    <DashboardShell maxWidth="6xl" className="!px-0">
      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="admin-sidebar w-full shrink-0 md:sticky md:top-24 md:w-60 md:self-start">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-bao/20 text-bao-light">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-bao-light">
                Student
              </p>
              <p className="text-sm font-medium text-[var(--foreground)]">
                {profile.full_name ?? "Learner"}
              </p>
            </div>
          </div>
          <p className="mb-5 truncate text-xs text-muted">{profile.email}</p>
          <StudentNav learnHref={learnHref} />
          <Link
            href="/"
            className="mt-6 inline-flex text-sm text-secondary transition-colors hover:text-[var(--foreground)]"
          >
            ← Back to site
          </Link>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </DashboardShell>
  );
}
