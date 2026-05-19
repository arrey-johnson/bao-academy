"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveAnnouncement } from "@/app/actions/admin";
import { AdminMessage } from "@/components/admin/AdminMessage";
import { Button } from "@/components/ui/button";

type Course = { id: string; title: string };
type Announcement = {
  id: string;
  title: string;
  body: string;
  course_id: string | null;
};

export function AnnouncementForm({
  courses,
  announcement,
  onCancel,
}: {
  courses: Course[];
  announcement?: Announcement;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fieldClass = "auth-input !pl-4 w-full";
  const labelClass = "block text-sm font-medium mb-2";
  const labelStyle = { color: "var(--auth-label)" };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);
    setError(null);
    setSuccess(null);
    const result = await saveAnnouncement(new FormData(form));
    if (result.ok) {
      setSuccess(announcement ? "Announcement updated." : "Announcement published.");
      if (!announcement) form.reset();
      router.refresh();
    } else setError(result.error);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {announcement && <input type="hidden" name="id" value={announcement.id} />}
      <div>
        <label htmlFor="ann-title" className={labelClass} style={labelStyle}>
          Title
        </label>
        <input
          id="ann-title"
          name="title"
          required
          defaultValue={announcement?.title ?? ""}
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="ann-body" className={labelClass} style={labelStyle}>
          Body
        </label>
        <textarea
          id="ann-body"
          name="body"
          required
          rows={4}
          defaultValue={announcement?.body ?? ""}
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="ann-course" className={labelClass} style={labelStyle}>
          Course (optional)
        </label>
        <select
          id="ann-course"
          name="courseId"
          defaultValue={announcement?.course_id ?? ""}
          className={fieldClass}
        >
          <option value="">All students</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>
      <AdminMessage error={error} success={success} />
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : announcement ? "Update" : "Publish"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
