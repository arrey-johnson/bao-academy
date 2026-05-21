import Link from "next/link";
import { requireSuperAdmin } from "@/lib/auth/require-admin";
import { CourseForm } from "@/components/admin/CourseForm";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PanelCard } from "@/components/dashboard/PanelCard";

export const dynamic = "force-dynamic";

export default async function AdminNewCoursePage() {
  await requireSuperAdmin();
  return (
    <div>
      <DashboardHeader
        title="Create course"
        description="Add a new course, then build modules, lessons, and slides on the next screen."
        action={
          <Link
            href="/admin/courses"
            className="text-sm text-secondary hover:text-[var(--foreground)]"
          >
            ← All courses
          </Link>
        }
      />

      <PanelCard title="Course details">
        <CourseForm />
      </PanelCard>
    </div>
  );
}
