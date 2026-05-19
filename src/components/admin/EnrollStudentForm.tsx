"use client";

import { useState } from "react";
import { enrollStudent } from "@/app/actions/admin";
import { AdminMessage } from "@/components/admin/AdminMessage";
import { Button } from "@/components/ui/button";

type Course = { id: string; title: string };

export function EnrollStudentForm({ courses }: { courses: Course[] }) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);
    setError(null);
    setSuccess(null);
    const result = await enrollStudent(new FormData(form));
    if (result.ok) {
      setSuccess("Student enrolled. They can sign in at /login.");
      form.reset();
    } else {
      setError(result.error);
    }
    setLoading(false);
  }

  const fieldClass = "auth-input !pl-4";
  const labelClass = "block text-sm font-medium";
  const labelStyle = { color: "var(--auth-label)" };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="fullName" className={labelClass} style={labelStyle}>
            Full name
          </label>
          <input id="fullName" name="fullName" className={fieldClass} placeholder="Student name" />
        </div>
        <div className="space-y-2">
          <label htmlFor="enroll-email" className={labelClass} style={labelStyle}>
            Email
          </label>
          <input id="enroll-email" name="email" type="email" required className={fieldClass} placeholder="student@example.com" />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="enroll-password" className={labelClass} style={labelStyle}>
            Password
          </label>
          <input id="enroll-password" name="password" type="text" required minLength={6} className={fieldClass} placeholder="Min. 6 characters" />
        </div>
        <div className="space-y-2">
          <label htmlFor="courseId" className={labelClass} style={labelStyle}>
            Enroll in course (optional)
          </label>
          <select id="courseId" name="courseId" className={fieldClass}>
            <option value="">— None —</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      <AdminMessage error={error} success={success} />
      <Button type="submit" disabled={loading}>
        {loading ? "Enrolling…" : "Enroll student"}
      </Button>
    </form>
  );
}
