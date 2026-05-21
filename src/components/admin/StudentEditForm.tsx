"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateStudent, resetStudentPassword } from "@/app/actions/admin";
import { AdminMessage } from "@/components/admin/AdminMessage";
import { Button } from "@/components/ui/button";
import {
  COURSE_ADMIN_ASSIGNABLE_ROLES,
  ROLE_LABELS,
  SUPER_ADMIN_ASSIGNABLE_ROLES,
} from "@/lib/auth/roles";

type Student = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string;
};

export function StudentEditForm({
  student,
  isSuperAdmin,
}: {
  student: Student;
  isSuperAdmin: boolean;
}) {
  const router = useRouter();
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const assignableRoles = isSuperAdmin
    ? SUPER_ADMIN_ASSIGNABLE_ROLES
    : COURSE_ADMIN_ASSIGNABLE_ROLES;

  const fieldClass = "auth-input !pl-4 w-full";
  const labelClass = "block text-sm font-medium mb-2";
  const labelStyle = { color: "var(--auth-label)" };

  async function saveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setProfileError(null);
    setProfileSuccess(null);
    const form = e.currentTarget;
    const result = await updateStudent(new FormData(form));
    if (result.ok) {
      setProfileSuccess("Profile updated.");
      router.refresh();
    } else {
      setProfileError(result.error);
    }
    setLoading(false);
  }

  async function savePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(null);
    const form = e.currentTarget;
    const result = await resetStudentPassword(new FormData(form));
    if (result.ok) setPwSuccess("Password updated.");
    else setPwError(result.error);
  }

  return (
    <div className="space-y-8">
      <form onSubmit={saveProfile} className="space-y-4">
        <input type="hidden" name="userId" value={student.id} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="fullName" className={labelClass} style={labelStyle}>
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              defaultValue={student.full_name ?? ""}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="email" className={labelClass} style={labelStyle}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={student.email ?? ""}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="role" className={labelClass} style={labelStyle}>
              Role
            </label>
            <select id="role" name="role" defaultValue={student.role} className={fieldClass}>
              {assignableRoles.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role] ?? role}
                </option>
              ))}
            </select>
            {isSuperAdmin && (
              <p className="mt-2 text-xs text-muted">
                Choose &quot;Course admin&quot; for staff who only manage students and
                enrollments.
              </p>
            )}
          </div>
        </div>
        <AdminMessage error={profileError} success={profileSuccess} />
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : "Save profile"}
        </Button>
      </form>

      <form onSubmit={savePassword} className="space-y-4 border-t border-[var(--border)] pt-6">
        <input type="hidden" name="userId" value={student.id} />
        <p className="text-sm font-medium text-[var(--foreground)]">Reset password</p>
        <div className="max-w-md">
          <label htmlFor="password" className={labelClass} style={labelStyle}>
            New password
          </label>
          <input
            id="password"
            name="password"
            type="text"
            minLength={6}
            required
            className={fieldClass}
            placeholder="Min. 6 characters"
          />
        </div>
        <AdminMessage error={pwError} success={pwSuccess} />
        <Button type="submit" variant="outline">
          Update password
        </Button>
      </form>
    </div>
  );
}
