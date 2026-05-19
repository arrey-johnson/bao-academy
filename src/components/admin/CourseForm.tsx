"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCourse, updateCourse } from "@/app/actions/admin";
import { AdminMessage } from "@/components/admin/AdminMessage";
import { Button } from "@/components/ui/button";

type Course = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  track: string;
  published: boolean;
  sort_order: number;
};

export function CourseForm({ course }: { course?: Course }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fieldClass = "auth-input !pl-4 w-full";
  const labelClass = "block text-sm font-medium mb-2";
  const labelStyle = { color: "var(--auth-label)" };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const result = course
      ? await updateCourse(fd)
      : await createCourse(fd);
    if (result.ok) {
      const newId =
        course?.id ??
        ("data" in result && result.data && "id" in result.data
          ? result.data.id
          : undefined);
      router.push(newId ? `/admin/courses/${newId}` : "/admin/courses");
      router.refresh();
    } else {
      setError(result.error);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {course && <input type="hidden" name="id" value={course.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className={labelClass} style={labelStyle}>
            Title
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={course?.title ?? ""}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="slug" className={labelClass} style={labelStyle}>
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            defaultValue={course?.slug ?? ""}
            placeholder="auto-from-title"
            className={fieldClass}
          />
        </div>
      </div>
      <div>
        <label htmlFor="description" className={labelClass} style={labelStyle}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={course?.description ?? ""}
          className={fieldClass}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="track" className={labelClass} style={labelStyle}>
            Track
          </label>
          <input
            id="track"
            name="track"
            defaultValue={course?.track ?? "html-css-js"}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="sortOrder" className={labelClass} style={labelStyle}>
            Sort order
          </label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={course?.sort_order ?? 0}
            className={fieldClass}
          />
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="published"
              defaultChecked={course?.published ?? false}
              className="rounded"
            />
            Published
          </label>
        </div>
      </div>
      <AdminMessage error={error} />
      <Button type="submit" disabled={loading}>
        {loading ? "Saving…" : course ? "Update course" : "Create course"}
      </Button>
    </form>
  );
}
