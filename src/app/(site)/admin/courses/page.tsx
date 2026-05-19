import Link from "next/link";
import { Plus } from "lucide-react";
import { getAdminCoursesList } from "@/lib/admin/courses";
import { CourseRowActions } from "@/components/admin/CourseRowActions";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const courses = await getAdminCoursesList();

  return (
    <div>
      <DashboardHeader
        title="Courses"
        description="Create, edit, publish, or delete courses. Open a course to manage modules, lessons, and slides."
        action={
          <Link href="/admin/courses/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New course
            </Button>
          </Link>
        }
      />

      <PanelCard noPadding>
        <DataTable
          data={courses}
          getRowKey={(c) => c.id}
          emptyMessage="No courses yet. Create your first course to get started."
          columns={[
            {
              key: "title",
              header: "Course",
              cell: (c) => (
                <div className="min-w-[12rem]">
                  <Link
                    href={`/admin/courses/${c.id}`}
                    className="font-semibold text-[var(--foreground)] hover:text-bao-light"
                  >
                    {c.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted">/learn/{c.slug}</p>
                  {c.description && (
                    <p className="mt-1 line-clamp-1 text-xs text-secondary">{c.description}</p>
                  )}
                </div>
              ),
            },
            {
              key: "track",
              header: "Track",
              cell: (c) => <span className="badge">{c.track}</span>,
            },
            {
              key: "status",
              header: "Status",
              cell: (c) => (
                <span className={c.published ? "badge badge-accent" : "badge"}>
                  {c.published ? "Published" : "Draft"}
                </span>
              ),
            },
            {
              key: "stats",
              header: "Content",
              cell: (c) => (
                <span className="text-secondary">
                  {c.moduleCount} module{c.moduleCount !== 1 ? "s" : ""}
                  <span className="mx-1 text-muted">·</span>
                  {c.enrollmentCount} enrolled
                </span>
              ),
            },
            {
              key: "order",
              header: "Order",
              cell: (c) => c.sort_order,
              className: "text-muted",
            },
            {
              key: "actions",
              header: "",
              className: "text-right",
              cell: (c) => (
                <CourseRowActions
                  courseId={c.id}
                  slug={c.slug}
                  published={c.published}
                  title={c.title}
                />
              ),
            },
          ]}
        />
      </PanelCard>
    </div>
  );
}
