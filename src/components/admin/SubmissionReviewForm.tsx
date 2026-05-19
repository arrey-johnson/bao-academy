"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { reviewSubmission, updateSubmissionStatus } from "@/app/actions/admin";
import { AdminMessage } from "@/components/admin/AdminMessage";
import { Button } from "@/components/ui/button";

export function SubmissionReviewForm({
  submissionId,
  currentStatus,
}: {
  submissionId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleReview(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    const result = await reviewSubmission(new FormData(e.currentTarget));
    if (result.ok) {
      setSuccess("Review saved.");
      router.refresh();
    } else setError(result.error);
    setLoading(false);
  }

  async function setStatus(status: string) {
    setLoading(true);
    setError(null);
    const result = await updateSubmissionStatus(submissionId, status);
    if (result.ok) {
      setSuccess(`Status set to ${status}.`);
      router.refresh();
    } else setError(result.error);
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleReview} className="space-y-3">
        <input type="hidden" name="submissionId" value={submissionId} />
        <label className="block text-sm font-medium" style={{ color: "var(--auth-label)" }}>
          Mentor comments
        </label>
        <textarea
          name="comments"
          rows={3}
          className="auth-input !pl-4 w-full text-sm"
          placeholder="Feedback for the student…"
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="approved" />
          Approve submission
        </label>
        <AdminMessage error={error} success={success} />
        <Button type="submit" size="sm" disabled={loading}>
          Submit review
        </Button>
      </form>
      <div className="flex flex-wrap gap-2 border-t border-[var(--border)] pt-3">
        <span className="text-xs text-muted w-full">Quick status (current: {currentStatus})</span>
        {(["in_review", "needs_revision", "approved"] as const).map((s) => (
          <Button
            key={s}
            type="button"
            size="sm"
            variant="outline"
            disabled={loading || currentStatus === s}
            onClick={() => setStatus(s)}
          >
            {s.replace("_", " ")}
          </Button>
        ))}
      </div>
    </div>
  );
}
