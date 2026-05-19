"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { saveSubmission } from "@/app/actions/student";
import { Button } from "@/components/ui/button";

type Submission = {
  id: string;
  status: string;
  github_url: string | null;
  deploy_url: string | null;
} | null;

export function SubmissionForm({
  assignmentId,
  submission,
  readOnly,
}: {
  assignmentId: string;
  submission: Submission;
  readOnly?: boolean;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fieldClass = "auth-input !pl-4 w-full";
  const locked = readOnly || submission?.status === "approved";

  async function submit(submitForReview: boolean) {
    if (locked || !formRef.current) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    const fd = new FormData(formRef.current);
    fd.set("assignmentId", assignmentId);
    fd.set("submit", String(submitForReview));
    const result = await saveSubmission(fd);
    if (result.ok) {
      setSuccess(submitForReview ? "Submitted for review!" : "Draft saved.");
      router.refresh();
    } else {
      setError(result.error);
    }
    setLoading(false);
  }

  return (
    <form ref={formRef} className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label className="mb-2 block text-sm font-medium" style={{ color: "var(--auth-label)" }}>
          GitHub repository URL
        </label>
        <input
          name="githubUrl"
          type="url"
          defaultValue={submission?.github_url ?? ""}
          disabled={locked}
          className={fieldClass}
          placeholder="https://github.com/you/project"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium" style={{ color: "var(--auth-label)" }}>
          Live deploy URL (optional)
        </label>
        <input
          name="deployUrl"
          type="url"
          defaultValue={submission?.deploy_url ?? ""}
          disabled={locked}
          className={fieldClass}
          placeholder="https://your-project.vercel.app"
        />
      </div>
      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {success}
        </p>
      )}
      {!locked && (
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" disabled={loading} onClick={() => submit(false)}>
            {loading ? "Saving…" : "Save draft"}
          </Button>
          <Button type="button" disabled={loading} onClick={() => submit(true)}>
            {loading ? "Submitting…" : "Submit for review"}
          </Button>
        </div>
      )}
    </form>
  );
}
