"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { assignEnrollment } from "@/app/actions/admin";
import { AdminMessage } from "@/components/admin/AdminMessage";
import { Button } from "@/components/ui/button";

type Student = { id: string; full_name: string | null; email: string | null };
type Course = { id: string; title: string };

export function AssignEnrollmentForm({
  students,
  courses,
}: {
  students: Student[];
  courses: Course[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fieldClass = "auth-input !pl-4 w-full";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    const result = await assignEnrollment(new FormData(e.currentTarget));
    if (result.ok) {
      setSuccess("Enrollment assigned.");
      e.currentTarget.reset();
      router.refresh();
    } else setError(result.error);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-3 sm:items-end">
      <div>
        <label className="mb-2 block text-sm font-medium" style={{ color: "var(--auth-label)" }}>
          Student
        </label>
        <select name="userId" required className={fieldClass}>
          <option value="">Select student</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.full_name ?? s.email} ({s.email})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium" style={{ color: "var(--auth-label)" }}>
          Course
        </label>
        <select name="courseId" required className={fieldClass}>
          <option value="">Select course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? "Assigning…" : "Assign"}
        </Button>
        <AdminMessage error={error} success={success} />
      </div>
    </form>
  );
}
