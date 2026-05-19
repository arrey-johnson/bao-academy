import { createClient } from "@/lib/supabase/server";

export async function getCoursesList() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select("id, title, slug, published")
    .order("sort_order");
  return data ?? [];
}

export async function getStudentsList() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, current_streak, created_at")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getCourseWithCurriculum(courseId: string) {
  const supabase = await createClient();
  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .maybeSingle();
  if (!course) return null;

  const { data: modules } = await supabase
    .from("modules")
    .select("id, title, slug, sort_order, lessons(id, title, slug, sort_order, estimated_minutes)")
    .eq("course_id", courseId)
    .order("sort_order");

  return { course, modules: modules ?? [] };
}

export async function getLessonWithSlides(lessonId: string) {
  const supabase = await createClient();
  const { data: lesson } = await supabase
    .from("lessons")
    .select("*, modules(id, title, course_id, courses(id, title, slug))")
    .eq("id", lessonId)
    .maybeSingle();
  if (!lesson) return null;

  const { data: slides } = await supabase
    .from("slides")
    .select("id, title, slide_type, sort_order, content")
    .eq("lesson_id", lessonId)
    .order("sort_order");

  return { lesson, slides: slides ?? [] };
}
