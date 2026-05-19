"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveSlide } from "@/app/actions/admin";
import { AdminMessage } from "@/components/admin/AdminMessage";
import { Button } from "@/components/ui/button";

type Slide = {
  id: string;
  title: string | null;
  slide_type: string;
  sort_order: number;
  content: { blocks: unknown[] };
};

const SLIDE_TYPES = ["concept", "example", "challenge", "quiz", "checkpoint", "task"];

export function SlideEditorForm({
  lessonId,
  slide,
  onDone,
}: {
  lessonId: string;
  slide?: Slide;
  onDone?: () => void;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fieldClass = "auth-input !pl-4 w-full";
  const labelClass = "block text-sm font-medium mb-2";
  const labelStyle = { color: "var(--auth-label)" };
  const defaultContent = JSON.stringify(slide?.content ?? { blocks: [] }, null, 2);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("lessonId", lessonId);
    const result = await saveSlide(fd);
    if (result.ok) {
      router.refresh();
      onDone?.();
    } else setError(result.error);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {slide && <input type="hidden" name="id" value={slide.id} />}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label htmlFor="slide-title" className={labelClass} style={labelStyle}>
            Title
          </label>
          <input
            id="slide-title"
            name="title"
            defaultValue={slide?.title ?? ""}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="slideType" className={labelClass} style={labelStyle}>
            Type
          </label>
          <select
            id="slideType"
            name="slideType"
            defaultValue={slide?.slide_type ?? "concept"}
            className={fieldClass}
          >
            {SLIDE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sortOrder" className={labelClass} style={labelStyle}>
            Order
          </label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={slide?.sort_order ?? 0}
            className={fieldClass}
          />
        </div>
      </div>
      <div>
        <label htmlFor="content" className={labelClass} style={labelStyle}>
          Content (JSON)
        </label>
        <textarea
          id="content"
          name="content"
          rows={12}
          defaultValue={defaultContent}
          className={`${fieldClass} font-mono text-xs`}
          spellCheck={false}
        />
        <p className="mt-1 text-xs text-muted">
          Block types: heading, text, code, challenge, visual. See seed slides in full-setup.sql.
        </p>
      </div>
      <AdminMessage error={error} />
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : slide ? "Update slide" : "Add slide"}
        </Button>
        {onDone && (
          <Button type="button" variant="outline" onClick={onDone}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
