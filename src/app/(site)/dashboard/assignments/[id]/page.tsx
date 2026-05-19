import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStudent } from "@/lib/student/require-student";
import { getAssignmentWithSubmission } from "@/lib/student/queries";
import { relationOne } from "@/lib/student/utils";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { SubmissionForm } from "@/components/student/SubmissionForm";
import { StatusBadge } from "@/components/student/StatusBadge";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function DashboardAssignmentDetailPage({ params }: Props) {
  const { id } = await params;
  const { user } = await requireStudent();
  const data = await getAssignmentWithSubmission(user.id, id);
  if (!data) notFound();

  const { assignment, submission, reviews } = data;
  const course = relationOne(
    assignment.courses as { title: string; slug: string } | { title: string; slug: string }[] | null
  );
  const readOnly =
    submission?.status === "approved" || submission?.status === "in_review";

  return (
    <div>
      <DashboardHeader
        title={assignment.title}
        description={course?.title}
        action={
          <Link
            href="/dashboard/assignments"
            className="text-sm text-secondary hover:text-[var(--foreground)]"
          >
            ← Assignments
          </Link>
        }
      />

      {assignment.description && (
        <PanelCard title="Brief" className="mb-6">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-secondary">
            {assignment.description}
          </p>
        </PanelCard>
      )}

      <PanelCard title="Your submission" className="mb-6">
        {submission && (
          <div className="mb-4">
            <StatusBadge status={submission.status} />
          </div>
        )}
        <SubmissionForm
          assignmentId={assignment.id}
          submission={submission}
          readOnly={readOnly}
        />
      </PanelCard>

      {reviews.length > 0 && (
        <PanelCard title="Mentor feedback">
          <ul className="space-y-4">
            {reviews.map((r) => (
              <li
                key={r.id}
                className="border-b border-[var(--surface-border)] pb-4 last:border-0 last:pb-0"
              >
                <p className="text-sm text-secondary">{r.comments}</p>
                <p className="mt-2 text-xs text-muted">
                  {r.approved ? "Approved" : "Revision requested"} ·{" "}
                  {new Date(r.created_at).toLocaleDateString(undefined, {
                    dateStyle: "medium",
                  })}
                </p>
              </li>
            ))}
          </ul>
        </PanelCard>
      )}
    </div>
  );
}
