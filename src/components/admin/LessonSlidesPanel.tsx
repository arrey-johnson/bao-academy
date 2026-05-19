"use client";

import { useState } from "react";
import { deleteSlide } from "@/app/actions/admin";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { SlideEditorForm } from "@/components/admin/SlideEditorForm";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { Button } from "@/components/ui/button";

type Slide = {
  id: string;
  title: string | null;
  slide_type: string;
  sort_order: number;
  content: { blocks: unknown[] };
};

export function LessonSlidesPanel({
  lessonId,
  slides,
}: {
  lessonId: string;
  slides: Slide[];
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const editing = slides.find((s) => s.id === editingId);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          type="button"
          size="sm"
          onClick={() => {
            setAdding(true);
            setEditingId(null);
          }}
        >
          Add slide
        </Button>
      </div>

      {(adding || editing) && (
        <PanelCard title={editing ? "Edit slide" : "New slide"}>
          <SlideEditorForm
            lessonId={lessonId}
            slide={editing}
            onDone={() => {
              setAdding(false);
              setEditingId(null);
            }}
          />
        </PanelCard>
      )}

      {slides.map((s) => (
        <PanelCard key={s.id}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="badge mr-2">{s.slide_type}</span>
              <span className="font-medium">
                #{s.sort_order} {s.title ?? "Untitled"}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingId(s.id);
                  setAdding(false);
                }}
              >
                Edit
              </Button>
              <DeleteButton
                label="Delete"
                confirmMessage="Delete this slide?"
                onDelete={() => deleteSlide(s.id)}
              />
            </div>
          </div>
          <pre className="mt-3 max-h-32 overflow-auto rounded-lg bg-[var(--surface-muted)] p-3 text-xs text-muted">
            {JSON.stringify(s.content, null, 2)}
          </pre>
        </PanelCard>
      ))}

      {!slides.length && !adding && (
        <p className="text-sm text-muted">No slides yet. Add your first slide above.</p>
      )}
    </div>
  );
}
