"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createCourse, updateCourse } from "@/app/actions/admin";
import { AdminMessage } from "@/components/admin/AdminMessage";
import { slugify } from "@/lib/admin/utils";
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

const TRACK_OPTIONS = [
  { value: "html-css-js", label: "HTML, CSS & JavaScript" },
  { value: "react", label: "React" },
  { value: "nodejs", label: "Node.js" },
  { value: "general", label: "General" },
];

export function CourseForm({ course }: { course?: Course }) {
  const router = useRouter();
  const isEdit = Boolean(course);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(course?.title ?? "");
  const [slug, setSlug] = useState(course?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(course?.slug));

  const previewSlug = useMemo(() => {
    const s = slug.trim() || (slugTouched ? "" : slugify(title));
    return s || "course-slug";
  }, [slug, slugTouched, title]);

  const fieldClass = "auth-input !pl-4 w-full";
  const labelClass = "block text-sm font-medium mb-2";
  const labelStyle = { color: "var(--auth-label)" };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);
    setError(null);
    setSuccess(null);

    const fd = new FormData(form);
    if (!String(fd.get("slug") ?? "").trim() && title.trim()) {
      fd.set("slug", slugify(title));
    }

    const result = isEdit ? await updateCourse(fd) : await createCourse(fd);

    if (result.ok) {
      if (isEdit) {
        setSuccess("Course updated.");
        router.refresh();
      } else {
        const newId =
          "data" in result && result.data && "id" in result.data ? result.data.id : undefined;
        if (newId) {
          router.push(`/admin/courses/${newId}`);
        } else {
          router.push("/admin/courses");
        }
        router.refresh();
      }
    } else {
      setError(result.error);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {course && <input type="hidden" name="id" value={course.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className={labelClass} style={labelStyle}>
            Title <span className="text-red-400">*</span>
          </label>
          <input
            id="title"
            name="title"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched && !isEdit) {
                setSlug(slugify(e.target.value));
              }
            }}
            className={fieldClass}
            placeholder="e.g. HTML, CSS & JavaScript"
          />
        </div>
        <div>
          <label htmlFor="slug" className={labelClass} style={labelStyle}>
            URL slug
          </label>
          <input
            id="slug"
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            className={fieldClass}
            placeholder="auto-from-title"
          />
          <p className="mt-1.5 text-xs text-muted">
            Students visit: /learn/{previewSlug}
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="description" className={labelClass} style={labelStyle}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={course?.description ?? ""}
          className={fieldClass}
          placeholder="Short summary shown on the student dashboard"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="track" className={labelClass} style={labelStyle}>
            Track
          </label>
          <select
            id="track"
            name="track"
            defaultValue={course?.track ?? "html-css-js"}
            className={fieldClass}
          >
            {TRACK_OPTIONS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sortOrder" className={labelClass} style={labelStyle}>
            Sort order
          </label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            min={0}
            defaultValue={course?.sort_order ?? 0}
            className={fieldClass}
          />
          <p className="mt-1.5 text-xs text-muted">Lower numbers appear first</p>
        </div>
        <div className="flex items-end pb-2">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm">
            <input
              type="checkbox"
              name="published"
              defaultChecked={course?.published ?? false}
              className="h-4 w-4 rounded border-[var(--border)]"
            />
            <span className="font-medium">Published</span>
            <span className="text-muted">(visible to students)</span>
          </label>
        </div>
      </div>

      <AdminMessage error={error} success={success} />

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : isEdit ? "Save changes" : "Create course"}
        </Button>
        {isEdit && (
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/courses")}
          >
            Back to courses
          </Button>
        )}
      </div>
    </form>
  );
}
