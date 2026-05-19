import { getAdminServiceClient } from "@/lib/admin/db";

export async function getCoursesList() {
  const service = await getAdminServiceClient();
  const { data } = await service
    .from("courses")
    .select("id, title, slug, published")
    .order("sort_order");
  return data ?? [];
}

export async function getStudentsList() {
  const service = await getAdminServiceClient();
  const { data } = await service
    .from("profiles")
    .select("id, email, full_name, role, current_streak, created_at")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getCourseWithCurriculum(courseId: string) {
  const service = await getAdminServiceClient();

  const { data: course, error: courseError } = await service
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .maybeSingle();

  if (courseError || !course) return null;

  const { data: modules } = await service
    .from("modules")
    .select("id, title, slug, sort_order")
    .eq("course_id", courseId)
    .order("sort_order");

  const moduleIds = (modules ?? []).map((m) => m.id);
  let lessonsByModule = new Map<string, Array<{
    id: string;
    title: string;
    slug: string;
    sort_order: number;
    estimated_minutes: number | null;
  }>>();

  if (moduleIds.length) {
    const { data: lessons } = await service
      .from("lessons")
      .select("id, module_id, title, slug, sort_order, estimated_minutes")
      .in("module_id", moduleIds)
      .order("sort_order");

    for (const lesson of lessons ?? []) {
      const list = lessonsByModule.get(lesson.module_id) ?? [];
      list.push({
        id: lesson.id,
        title: lesson.title,
        slug: lesson.slug,
        sort_order: lesson.sort_order,
        estimated_minutes: lesson.estimated_minutes,
      });
      lessonsByModule.set(lesson.module_id, list);
    }
  }

  return {
    course,
    modules: (modules ?? []).map((m) => ({
      ...m,
      lessons: lessonsByModule.get(m.id) ?? [],
    })),
  };
}

export async function getLessonWithSlides(lessonId: string) {
  const service = await getAdminServiceClient();

  const { data: lesson, error: lessonError } = await service
    .from("lessons")
    .select("id, title, slug, description, module_id")
    .eq("id", lessonId)
    .maybeSingle();

  if (lessonError || !lesson) return null;

  const { data: mod } = await service
    .from("modules")
    .select("id, title, course_id")
    .eq("id", lesson.module_id)
    .maybeSingle();

  let course: { id: string; title: string; slug: string } | null = null;
  if (mod?.course_id) {
    const { data: courseRow } = await service
      .from("courses")
      .select("id, title, slug")
      .eq("id", mod.course_id)
      .maybeSingle();
    course = courseRow;
  }

  const { data: slides } = await service
    .from("slides")
    .select("id, title, slide_type, sort_order, content")
    .eq("lesson_id", lessonId)
    .order("sort_order");

  return {
    lesson: {
      ...lesson,
      modules: mod
        ? {
            id: mod.id,
            title: mod.title,
            course_id: mod.course_id,
            courses: course,
          }
        : null,
    },
    slides: slides ?? [],
  };
}
