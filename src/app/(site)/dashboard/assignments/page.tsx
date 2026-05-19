import Link from "next/link";
import { requireStudent } from "@/lib/student/require-student";
import { getStudentAssignments } from "@/lib/student/queries";
import { relationOne } from "@/lib/student/utils";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { StatusBadge } from "@/components/student/StatusBadge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function DashboardAssignmentsPage() {
  const { user } = await requireStudent();
  const assignments = await getStudentAssignments(user.id);

  return (
    <div>
      <DashboardHeader
        title="Assignments"
        description="Project briefs tied to your courses. Submit your work for mentor review."
      />

      <div className="space-y-4">
        {assignments.length ? (
          assignments.map((a) => {
            const course = relationOne(a.courses as { title: string; slug: string } | { title: string; slug: string }[] | null);
            const status = a.submission?.status ?? "not_started";
            return (
              <PanelCard key={a.id}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold">{a.title}</h3>
                    {course && (
                      <p className="mt-1 text-sm text-muted">{course.title}</p>
                    )}
                    {a.description && (
                      <p className="mt-2 text-sm text-secondary line-clamp-3">
                        {a.description}
                      </p>
                    )}
                    {a.due_at && (
                      <p className="mt-2 text-xs text-muted">
                        Due{" "}
                        {new Date(a.due_at).toLocaleDateString(undefined, {
                          dateStyle: "medium",
                        })}
                      </p>
                    )}
                    <div className="mt-3">
                      <StatusBadge
                        status={status === "not_started" ? "draft" : status}
                      />
                    </div>
                  </div>
                  <Link href={`/dashboard/assignments/${a.id}`}>
                    <Button size="sm">
                      {a.submission ? "View submission" : "Start assignment"}
                    </Button>
                  </Link>
                </div>
              </PanelCard>
            );
          })
        ) : (
          <PanelCard>
            <p className="text-secondary">
              No assignments yet. Complete lessons with project tasks — your admin can add
              assignments in Supabase or via the curriculum.
            </p>
          </PanelCard>
        )}
      </div>
    </div>
  );
}
