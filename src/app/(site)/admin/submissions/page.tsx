import Link from "next/link";
import { getAdminSubmissionsList } from "@/lib/admin/submissions";
import { SubmissionReviewForm } from "@/components/admin/SubmissionReviewForm";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PanelCard } from "@/components/dashboard/PanelCard";

export const dynamic = "force-dynamic";

export default async function AdminSubmissionsPage() {
  const rows = await getAdminSubmissionsList();

  return (
    <div>
      <DashboardHeader
        title="Submissions"
        description="Review student project submissions and update status."
      />

      <div className="space-y-4">
        {rows.length ? (
          rows.map((s) => (
            <PanelCard key={s.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-[var(--foreground)]">
                    {s.assignmentTitle ?? "Assignment"}
                  </p>
                  <p className="mt-1 text-sm text-secondary">
                    {s.studentName ?? s.studentEmail ?? "Unknown student"}
                  </p>
                  <span className="badge mt-2 capitalize">{s.status.replace("_", " ")}</span>
                </div>
                <div className="flex flex-col gap-1 text-sm">
                  {s.github_url && (
                    <Link href={s.github_url} target="_blank" className="text-bao-light hover:underline">
                      GitHub →
                    </Link>
                  )}
                  {s.deploy_url && (
                    <Link href={s.deploy_url} target="_blank" className="text-bao-light hover:underline">
                      Deploy →
                    </Link>
                  )}
                </div>
              </div>

              <div className="mt-4 border-t border-[var(--border)] pt-4">
                <SubmissionReviewForm submissionId={s.id} currentStatus={s.status} />
              </div>
            </PanelCard>
          ))
        ) : (
          <PanelCard>
            <p className="text-secondary">
              No submissions in the queue. Students submit assignments from their dashboard when
              assignments are enabled.
            </p>
          </PanelCard>
        )}
      </div>
    </div>
  );
}
