"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateStudentProfile } from "@/app/actions/student";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function ProfileForm({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) {
  const router = useRouter();
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSuccess, setNameSuccess] = useState<string | null>(null);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fieldClass = "auth-input !pl-4 w-full";
  const labelClass = "mb-2 block text-sm font-medium";
  const labelStyle = { color: "var(--auth-label)" };

  async function saveName(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setNameError(null);
    setNameSuccess(null);
    const form = e.currentTarget;
    const result = await updateStudentProfile(new FormData(form));
    if (result.ok) {
      setNameSuccess("Profile updated.");
      router.refresh();
    } else setNameError(result.error);
    setLoading(false);
  }

  async function changePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setPwError(null);
    setPwSuccess(null);
    const fd = new FormData(form);
    const password = String(fd.get("password") ?? "");
    if (password.length < 6) {
      setPwError("Password must be at least 6 characters.");
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setPwError(error.message);
    else {
      setPwSuccess("Password updated.");
      form.reset();
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={saveName} className="space-y-4">
        <div>
          <label htmlFor="fullName" className={labelClass} style={labelStyle}>
            Display name
          </label>
          <input
            id="fullName"
            name="fullName"
            defaultValue={fullName}
            required
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>
            Email
          </label>
          <input value={email} disabled className={`${fieldClass} opacity-60`} />
          <p className="mt-1 text-xs text-muted">Contact your admin to change your email.</p>
        </div>
        {nameError && <p className="text-sm text-red-400">{nameError}</p>}
        {nameSuccess && <p className="text-sm text-emerald-400">{nameSuccess}</p>}
        <Button type="submit" disabled={loading}>
          Save profile
        </Button>
      </form>

      <form
        onSubmit={changePassword}
        className="space-y-4 border-t border-[var(--border)] pt-6"
      >
        <p className="text-sm font-medium text-[var(--foreground)]">Change password</p>
        <div className="max-w-md">
          <label htmlFor="password" className={labelClass} style={labelStyle}>
            New password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            minLength={6}
            required
            className={fieldClass}
          />
        </div>
        {pwError && <p className="text-sm text-red-400">{pwError}</p>}
        {pwSuccess && <p className="text-sm text-emerald-400">{pwSuccess}</p>}
        <Button type="submit" variant="outline">
          Update password
        </Button>
      </form>
    </div>
  );
}
