"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createModule, createLesson, deleteModule, deleteLesson } from "@/app/actions/admin";
import { AdminMessage } from "@/components/admin/AdminMessage";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const fieldClass = "auth-input !pl-4 w-full text-sm";
const labelClass = "block text-xs font-medium mb-1";
const labelStyle = { color: "var(--auth-label)" };

export function AddModuleForm({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);
    setError(null);
    const fd = new FormData(form);
    fd.set("courseId", courseId);
    const result = await createModule(fd);
    if (result.ok) {
      form.reset();
      router.refresh();
    } else setError(result.error);
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-3">
      <div className="min-w-[12rem] flex-1">
        <label className={labelClass} style={labelStyle}>
          New module
        </label>
        <input name="title" required placeholder="Module title" className={fieldClass} />
      </div>
      <Button type="submit" size="sm" disabled={loading}>
        Add module
      </Button>
      <AdminMessage error={error} />
    </form>
  );
}

export function AddLessonForm({ moduleId }: { moduleId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);
    setError(null);
    const fd = new FormData(form);
    fd.set("moduleId", moduleId);
    const result = await createLesson(fd);
    if (result.ok) {
      form.reset();
      router.refresh();
    } else setError(result.error);
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="mt-3 flex flex-wrap items-end gap-3 border-t border-[var(--border)] pt-3">
      <input type="hidden" name="moduleId" value={moduleId} />
      <div className="min-w-[10rem] flex-1">
        <label className={labelClass} style={labelStyle}>
          New lesson
        </label>
        <input name="title" required placeholder="Lesson title" className={fieldClass} />
      </div>
      <Button type="submit" size="sm" variant="outline" disabled={loading}>
        Add lesson
      </Button>
      {error && <p className="w-full text-xs text-red-400">{error}</p>}
    </form>
  );
}

type LessonRow = { id: string; title: string; slug: string; sort_order: number };

export function ModuleBlock({
  moduleId,
  title,
  lessons,
  courseId,
}: {
  moduleId: string;
  title: string;
  lessons: LessonRow[];
  courseId: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/30 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-semibold text-[var(--foreground)]">{title}</h4>
        <DeleteButton
          label="Remove module"
          confirmMessage="Delete this module and all its lessons?"
          onDelete={() => deleteModule(moduleId)}
        />
      </div>
      <ul className="mt-3 space-y-2">
        {lessons.map((l) => (
          <li
            key={l.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-[var(--surface)] px-3 py-2 text-sm"
          >
            <Link
              href={`/admin/courses/${courseId}/lessons/${l.id}`}
              className="font-medium hover:text-bao-light"
            >
              {l.title}
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">/learn/…/{l.slug}</span>
              <DeleteButton
                label="Delete"
                confirmMessage="Delete this lesson and all slides?"
                onDelete={() => deleteLesson(l.id)}
              />
            </div>
          </li>
        ))}
        {!lessons.length && (
          <li className="text-xs text-muted">No lessons yet.</li>
        )}
      </ul>
      <AddLessonForm moduleId={moduleId} />
    </div>
  );
}
