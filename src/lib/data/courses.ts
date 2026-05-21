import { createClient } from "@/lib/supabase/server";

type LessonRef = {
  id: string;
  slug: string;
  sort_order: number;
};

type ModuleWithLessons = {
  sort_order: number;
  lessons: LessonRef[] | null;
};

/** Lessons in course order: module sort_order, then lesson sort_order within each module. */
export function orderCourseLessons(modules: ModuleWithLessons[]): LessonRef[] {
  return [...modules]
    .sort((a, b) => a.sort_order - b.sort_order)
    .flatMap((mod) =>
      [...(mod.lessons ?? [])].sort((a, b) => a.sort_order - b.sort_order)
    );
}

export async function getNextLessonSlug(
  courseSlug: string,
  lessonId: string
): Promise<string | null> {
  const data = await getCourseLessons(courseSlug);
  if (!data) return null;

  const ordered = orderCourseLessons(
    data.modules as ModuleWithLessons[]
  );
  const index = ordered.findIndex((l) => l.id === lessonId);
  if (index < 0 || index >= ordered.length - 1) return null;
  return ordered[index + 1].slug;
}

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
