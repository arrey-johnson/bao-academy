import Link from "next/link";
import { requireStudent } from "@/lib/student/require-student";
import { getStudentSubmissions } from "@/lib/student/queries";
import { relationOne } from "@/lib/student/utils";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { StatusBadge } from "@/components/student/StatusBadge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function DashboardSubmissionsPage() {
  const { user } = await requireStudent();
  const submissions = await getStudentSubmissions(user.id);

  return (
    <div>
      <DashboardHeader
        title="Submissions"
        description="Track status and mentor feedback on work you have submitted."
      />

      <div className="space-y-4">
        {submissions.length ? (
          submissions.map((s) => {
            const assignment = relationOne(
              s.assignments as
                | { id: string; title: string; courses: { title: string } | { title: string }[] | null }
                | { id: string; title: string; courses: { title: string } | { title: string }[] | null }[]
                | null
            );
            const courseTitle = relationOne(assignment?.courses ?? null)?.title;
            const reviews = (s.reviews ?? []) as {
              comments: string | null;
              approved: boolean | null;
            }[];
            const latestReview = reviews[0];

            return (
              <PanelCard key={s.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{assignment?.title ?? "Assignment"}</h3>
                    {courseTitle && (
                      <p className="mt-1 text-sm text-muted">{courseTitle}</p>
                    )}
                    <div className="mt-2">
                      <StatusBadge status={s.status} />
                    </div>
                  </div>
                  {assignment && (
                    <Link href={`/dashboard/assignments/${assignment.id}`}>
                      <Button variant="outline" size="sm">
                        Open
                      </Button>
                    </Link>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  {s.github_url && (
                    <Link
                      href={s.github_url}
                      target="_blank"
                      className="text-bao-light hover:underline"
                    >
                      GitHub
                    </Link>
                  )}
                  {s.deploy_url && (
                    <Link
                      href={s.deploy_url}
                      target="_blank"
                      className="text-bao-light hover:underline"
                    >
                      Live site
                    </Link>
                  )}
                </div>
                {latestReview?.comments && (
                  <p className="mt-4 rounded-lg bg-[var(--surface-muted)] p-3 text-sm text-secondary">
                    {latestReview.comments}
                  </p>
                )}
              </PanelCard>
            );
          })
        ) : (
          <PanelCard>
            <p className="text-secondary">
              No submissions yet.{" "}
              <Link href="/dashboard/assignments" className="text-bao-light hover:underline">
                Go to assignments
              </Link>{" "}
              to submit your first project.
            </p>
          </PanelCard>
        )}
      </div>
    </div>
  );
}
