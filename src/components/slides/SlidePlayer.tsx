"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SlideBlockRenderer } from "@/components/slides/SlideBlockRenderer";
import type { Slide, SlideContent } from "@/types/slides";
import { cn } from "@/lib/utils";
import { saveSlideProgress } from "@/app/actions/progress";

type Props = {
  slides: Slide[];
  lessonId: string;
  lessonTitle: string;
  courseSlug: string;
  nextLessonSlug: string | null;
  initialIndex: number;
  completedSlideIds: string[];
  bookmarkIndex: number | null;
};

export function SlidePlayer({
  slides,
  lessonId,
  lessonTitle,
  courseSlug,
  nextLessonSlug,
  initialIndex,
  completedSlideIds,
  bookmarkIndex,
}: Props) {
  const router = useRouter();
  const [index, setIndex] = useState(initialIndex);
  const [completed, setCompleted] = useState<Set<string>>(
    () => new Set(completedSlideIds)
  );
  const [bookmark, setBookmark] = useState<number | null>(bookmarkIndex);
  const [saving, setSaving] = useState(false);

  const current = slides[index];
  const content = (current?.content ?? { blocks: [] }) as SlideContent;
  const progress = ((index + 1) / slides.length) * 100;

  const persist = useCallback(
    async (
      nextIndex: number,
      completedIds: Set<string>,
      markComplete?: string
    ) => {
      const ids = new Set(completedIds);
      if (markComplete) ids.add(markComplete);
      setSaving(true);
      const result = await saveSlideProgress({
        lessonId,
        currentSlideIndex: nextIndex,
        completedSlideIds: [...ids],
        bookmarkSlideIndex: bookmark,
        isCompleted: ids.size >= slides.length,
      });
      setSaving(false);
      return result;
    },
    [lessonId, bookmark, slides.length]
  );

  const goNext = async () => {
    if (!current) return;
    const nextCompleted = new Set(completed);
    nextCompleted.add(current.id);
    setCompleted(nextCompleted);

    if (index < slides.length - 1) {
      const next = index + 1;
      setIndex(next);
      await persist(next, nextCompleted);
    } else {
      const result = await persist(index, nextCompleted);
      if (result && "ok" in result && result.ok) {
        if (nextLessonSlug) {
          router.push(`/learn/${courseSlug}/${nextLessonSlug}`);
        } else {
          router.push(`/learn/${courseSlug}`);
        }
      }
    }
  };

  const goPrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const toggleBookmark = async () => {
    const next = bookmark === index ? null : index;
    setBookmark(next);
    setSaving(true);
    await saveSlideProgress({
      lessonId,
      currentSlideIndex: index,
      completedSlideIds: [...completed],
      bookmarkSlideIndex: next,
      isCompleted: completed.size >= slides.length,
    });
    setSaving(false);
  };

  if (!current) return null;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <div className="border-b border-[var(--surface-border)] px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <p className="flex-1 truncate text-sm font-medium text-secondary">
            {lessonTitle}
          </p>
          <span className="text-xs text-muted">
            {index + 1} / {slides.length}
          </span>
        </div>
        <div className="progress-track mx-auto mt-2 h-1.5 max-w-3xl">
          <div
            className="progress-fill transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mx-auto mt-2 flex max-w-3xl justify-center gap-1">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-colors",
                i === index
                  ? "bg-bao w-4"
                  : completed.has(s.id)
                    ? "bg-bao/50"
                    : "bg-[var(--progress-track)]"
              )}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-4 md:p-8">
        <div
          className="surface-card w-full max-w-2xl space-y-6 !rounded-3xl p-8 md:p-12"
          onTouchStart={(e) => {
            const x = e.touches[0].clientX;
            (e.currentTarget as HTMLElement).dataset.touchX = String(x);
          }}
          onTouchEnd={(e) => {
            const start = Number(
              (e.currentTarget as HTMLElement).dataset.touchX ?? 0
            );
            const diff = e.changedTouches[0].clientX - start;
            if (diff < -50) goNext();
            if (diff > 50) goPrev();
          }}
        >
          <span className="badge-accent inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            {current.slide_type}
          </span>
          <div className="space-y-4">
            {content.blocks.map((block, i) => (
              <SlideBlockRenderer key={i} block={block} />
            ))}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-[var(--surface-border)] bg-[var(--surface-card)]/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={goPrev}
            disabled={index === 0}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleBookmark}
            aria-label="Bookmark"
          >
            <Bookmark
              className={cn(
                "h-5 w-5",
                bookmark === index && "fill-bao text-bao"
              )}
            />
          </Button>
          <Button
            className="flex-1"
            onClick={goNext}
            disabled={saving}
          >
            {index === slides.length - 1 ? "Complete lesson" : "Continue"}
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
