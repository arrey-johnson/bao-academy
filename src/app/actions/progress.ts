"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveSlideProgress({
  lessonId,
  currentSlideIndex,
  completedSlideIds,
  bookmarkSlideIndex,
  isCompleted,
}: {
  lessonId: string;
  currentSlideIndex: number;
  completedSlideIds: string[];
  bookmarkSlideIndex: number | null;
  isCompleted: boolean;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const today = new Date().toISOString().slice(0, 10);

  const { data: profile } = await supabase
    .from("profiles")
    .select("current_streak, last_activity_date")
    .eq("id", user.id)
    .single();

  let streak = profile?.current_streak ?? 0;
  const last = profile?.last_activity_date;
  if (last !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const y = yesterday.toISOString().slice(0, 10);
    streak = last === y ? streak + 1 : 1;
    await supabase
      .from("profiles")
      .update({ current_streak: streak, last_activity_date: today })
      .eq("id", user.id);
  }

  await supabase.from("lesson_progress").upsert(
    {
      user_id: user.id,
      lesson_id: lessonId,
      current_slide_index: currentSlideIndex,
      completed_slide_ids: completedSlideIds,
      bookmark_slide_index: bookmarkSlideIndex,
      is_completed: isCompleted,
      completed_at: isCompleted ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,lesson_id" }
  );

  const { data: lesson } = await supabase
    .from("lessons")
    .select("module_id, modules(course_id)")
    .eq("id", lessonId)
    .single();

  const modules = lesson?.modules as { course_id: string } | { course_id: string }[] | null;
  const courseId = Array.isArray(modules) ? modules[0]?.course_id : modules?.course_id;

  if (courseId) {
    const { computeCourseProgressPercent } = await import("@/lib/student/progress");
    const pct = await computeCourseProgressPercent(
      supabase,
      user.id,
      courseId,
      completedSlideIds
    );

    await supabase.from("enrollments").upsert(
      {
        user_id: user.id,
        course_id: courseId,
        progress_percent: pct,
        last_lesson_id: lessonId,
      },
      { onConflict: "user_id,course_id" }
    );
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/progress");
  revalidatePath("/dashboard/bookmarks");
  revalidatePath("/learn", "layout");

  if (isCompleted && courseId) {
    const { data: course } = await supabase
      .from("courses")
      .select("slug")
      .eq("id", courseId)
      .single();
    if (course?.slug) {
      revalidatePath(`/learn/${course.slug}`);
    }
  }

  return { ok: true };
}

export async function enrollInCourse(courseId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  await supabase.from("enrollments").upsert(
    { user_id: user.id, course_id: courseId, progress_percent: 0 },
    { onConflict: "user_id,course_id" }
  );

  revalidatePath("/dashboard");
  return { ok: true };
}
