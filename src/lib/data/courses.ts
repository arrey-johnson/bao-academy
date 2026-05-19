import { createClient } from "@/lib/supabase/server";

export async function getPublishedCourse(slug: string) {
  const supabase = await createClient();
  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  return course;
}

export async function getCourseLessons(courseSlug: string) {
  const supabase = await createClient();
  const { data: course } = await supabase
    .from("courses")
    .select("id, title, slug")
    .eq("slug", courseSlug)
    .single();

  if (!course) return null;

  const { data: modules } = await supabase
    .from("modules")
    .select("id, title, slug, sort_order, lessons(id, title, slug, description, estimated_minutes, sort_order)")
    .eq("course_id", course.id)
    .order("sort_order");

  return { course, modules: modules ?? [] };
}

export async function getLessonWithSlides(courseSlug: string, lessonSlug: string) {
  const supabase = await createClient();
  const { data: course } = await supabase
    .from("courses")
    .select("id, title, slug")
    .eq("slug", courseSlug)
    .single();

  if (!course) return null;

  const { data: modules } = await supabase
    .from("modules")
    .select("id, lessons!inner(id, title, slug, description, estimated_minutes, module_id)")
    .eq("course_id", course.id);

  const allLessons = modules?.flatMap((m) => m.lessons) ?? [];
  const lesson = allLessons.find(
    (l) => (l as { slug: string }).slug === lessonSlug
  ) as {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    estimated_minutes: number;
    module_id: string;
  } | undefined;

  if (!lesson) return null;

  const { data: slides } = await supabase
    .from("slides")
    .select("*")
    .eq("lesson_id", lesson.id)
    .order("sort_order");

  return { course, lesson, slides: slides ?? [] };
}
