import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getLessonWithSlides, getNextLessonSlug } from "@/lib/data/courses";
import { SlidePlayer } from "@/components/slides/SlidePlayer";
import type { Slide, SlideContent } from "@/types/slides";

export const dynamic = "force-dynamic";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, lessonSlug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=/learn/${courseSlug}/${lessonSlug}`);

  const data = await getLessonWithSlides(courseSlug, lessonSlug);
  if (!data) notFound();

  const { course, lesson, slides } = data;
  const nextLessonSlug = await getNextLessonSlug(courseSlug, lesson.id);

  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("lesson_id", lesson.id)
    .maybeSingle();

  const typedSlides: Slide[] = slides.map((s) => ({
    id: s.id,
    lesson_id: s.lesson_id,
    sort_order: s.sort_order,
    slide_type: s.slide_type,
    title: s.title,
    content: s.content as SlideContent,
  }));

  return (
    <div>
      <div className="border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
        <Link
          href={`/learn/${courseSlug}`}
          className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <ChevronLeft className="h-4 w-4" />
          {course.title}
        </Link>
      </div>
      <SlidePlayer
        slides={typedSlides}
        lessonId={lesson.id}
        lessonTitle={lesson.title}
        courseSlug={courseSlug}
        nextLessonSlug={nextLessonSlug}
        initialIndex={progress?.current_slide_index ?? 0}
        completedSlideIds={progress?.completed_slide_ids ?? []}
        bookmarkIndex={progress?.bookmark_slide_index ?? null}
      />
    </div>
  );
}
