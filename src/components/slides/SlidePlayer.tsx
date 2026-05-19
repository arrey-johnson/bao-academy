"use client";

import { useCallback, useEffect, useState } from "react";
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
  initialIndex: number;
  completedSlideIds: string[];
  bookmarkIndex: number | null;
};

export function SlidePlayer({
  slides,
  lessonId,
  lessonTitle,
  initialIndex,
  completedSlideIds,
  bookmarkIndex,
}: Props) {
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
    async (nextIndex: number, markComplete?: string) => {
      const ids = new Set(completed);
      if (markComplete) ids.add(markComplete);
      setSaving(true);
      await saveSlideProgress({
        lessonId,
        currentSlideIndex: nextIndex,
        completedSlideIds: [...ids],
        bookmarkSlideIndex: bookmark,
        isCompleted: ids.size >= slides.length,
      });
      setSaving(false);
    },
    [completed, lessonId, bookmark, slides.length]
  );

  const goNext = async () => {
    if (!current) return;
    const nextCompleted = new Set(completed);
    nextCompleted.add(current.id);
    setCompleted(nextCompleted);

    if (index < slides.length - 1) {
      const next = index + 1;
      setIndex(next);
      await persist(next, current.id);
    } else {
      await persist(index, current.id);
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
      <div className="border-b border-zinc-800 px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <p className="flex-1 truncate text-sm font-medium text-zinc-500">
            {lessonTitle}
          </p>
          <span className="text-xs text-zinc-400">
            {index + 1} / {slides.length}
          </span>
        </div>
        <div className="mx-auto mt-2 h-1.5 max-w-3xl overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-bao transition-all duration-300"
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
                    : "bg-zinc-300 dark:bg-zinc-600"
              )}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-4 md:p-8">
        <div
          className="w-full max-w-2xl space-y-6 rounded-3xl border border-zinc-800 bg-zinc-950 p-8 shadow-xl shadow-bao/5 md:p-12"
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
          <span className="inline-flex items-center gap-1 rounded-full bg-bao/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-bao-light dark:text-bao-muted">
            {current.slide_type}
          </span>
          <div className="space-y-4">
            {content.blocks.map((block, i) => (
              <SlideBlockRenderer key={i} block={block} />
            ))}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-zinc-800 bg-black/90 px-4 py-4 backdrop-blur">
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
