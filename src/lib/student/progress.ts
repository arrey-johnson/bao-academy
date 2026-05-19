import type { SupabaseClient } from "@supabase/supabase-js";

/** Recompute course progress from all completed slides across lessons. */
export async function computeCourseProgressPercent(
  supabase: SupabaseClient,
  userId: string,
  courseId: string,
  extraCompletedSlideIds: string[] = []
): Promise<number> {
  const { data: moduleRows } = await supabase
    .from("modules")
    .select("id")
    .eq("course_id", courseId);

  const moduleIds = moduleRows?.map((m) => m.id) ?? [];
  if (!moduleIds.length) return 0;

  const { data: lessonRows } = await supabase
    .from("lessons")
    .select("id")
    .in("module_id", moduleIds);

  const lessonIds = lessonRows?.map((l) => l.id) ?? [];
  if (!lessonIds.length) return 0;

  const { count: totalSlides } = await supabase
    .from("slides")
    .select("id", { count: "exact", head: true })
    .in("lesson_id", lessonIds);

  const total = totalSlides ?? 0;
  if (total === 0) return 0;

  const { data: progressRows } = await supabase
    .from("lesson_progress")
    .select("completed_slide_ids")
    .eq("user_id", userId)
    .in("lesson_id", lessonIds);

  const completed = new Set<string>(extraCompletedSlideIds);
  for (const row of progressRows ?? []) {
    for (const id of row.completed_slide_ids ?? []) {
      completed.add(id);
    }
  }

  return Math.min(100, Math.round((completed.size / total) * 100));
}
