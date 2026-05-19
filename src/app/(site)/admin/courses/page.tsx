import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { TogglePublishedButton } from "@/components/admin/TogglePublishedButton";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, slug, published, sort_order, track, description")
    .order("sort_order");

  return (
    <div>
      <DashboardHeader
        title="Courses"
        description="Build curriculum: modules, lessons, and slide content."
        action={
          <Link href="/admin/courses/new">
            <Button>New course</Button>
          </Link>
        }
      />

      <div className="space-y-4">
        {courses?.length ? (
          courses.map((c) => (
            <PanelCard key={c.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/courses/${c.id}`}
                      className="text-lg font-semibold text-[var(--foreground)] hover:text-bao-light"
                    >
                      {c.title}
                    </Link>
                    <span className={c.published ? "badge badge-accent" : "badge"}>
                      {c.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">/learn/{c.slug}</p>
                  {c.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-secondary">{c.description}</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/admin/courses/${c.id}`}>
                    <Button size="sm">Edit curriculum</Button>
                  </Link>
                  <TogglePublishedButton courseId={c.id} published={c.published} />
                  <Link href={`/learn/${c.slug}`}>
                    <Button variant="outline" size="sm">
                      Preview
                    </Button>
                  </Link>
                </div>
              </div>
            </PanelCard>
          ))
        ) : (
          <PanelCard>
            <p className="text-secondary">
              No courses yet.{" "}
              <Link href="/admin/courses/new" className="text-bao-light hover:underline">
                Create one
              </Link>{" "}
              or run <code className="rounded bg-[var(--surface-muted)] px-1.5 py-0.5 text-sm">supabase/full-setup.sql</code>.
            </p>
          </PanelCard>
        )}
      </div>
    </div>
  );
}
