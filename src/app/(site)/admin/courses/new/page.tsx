import Link from "next/link";
import { CourseForm } from "@/components/admin/CourseForm";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PanelCard } from "@/components/dashboard/PanelCard";

export const dynamic = "force-dynamic";

export default function AdminNewCoursePage() {
  return (
    <div>
      <DashboardHeader
        title="New course"
        description="Create a course, then add modules, lessons, and slides."
        action={
          <Link href="/admin/courses" className="text-sm text-secondary hover:text-[var(--foreground)]">
            ← Courses
          </Link>
        }
      />
      <PanelCard>
        <CourseForm />
      </PanelCard>
    </div>
  );
}
