import { getAdminServiceClient } from "@/lib/admin/db";

export type AdminCourseRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  track: string;
  published: boolean;
  sort_order: number;
  created_at: string;
  moduleCount: number;
  enrollmentCount: number;
};

export async function getAdminCoursesList(): Promise<AdminCourseRow[]> {
  const service = await getAdminServiceClient();

  const { data: courses, error } = await service
    .from("courses")
    .select("id, title, slug, description, track, published, sort_order, created_at")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[admin/courses] list:", error.message);
    return [];
  }

  if (!courses?.length) return [];

  const courseIds = courses.map((c) => c.id);

  const [{ data: modules }, { data: enrollments }] = await Promise.all([
    service.from("modules").select("id, course_id").in("course_id", courseIds),
    service.from("enrollments").select("id, course_id").in("course_id", courseIds),
  ]);

  const moduleCountByCourse = new Map<string, number>();
  for (const m of modules ?? []) {
    moduleCountByCourse.set(m.course_id, (moduleCountByCourse.get(m.course_id) ?? 0) + 1);
  }

  const enrollmentCountByCourse = new Map<string, number>();
  for (const e of enrollments ?? []) {
    enrollmentCountByCourse.set(
      e.course_id,
      (enrollmentCountByCourse.get(e.course_id) ?? 0) + 1
    );
  }

  return courses.map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    description: c.description,
    track: c.track,
    published: c.published,
    sort_order: c.sort_order,
    created_at: c.created_at,
    moduleCount: moduleCountByCourse.get(c.id) ?? 0,
    enrollmentCount: enrollmentCountByCourse.get(c.id) ?? 0,
  }));
}

export async function getAdminCourseById(courseId: string) {
  const service = await getAdminServiceClient();
  const { data, error } = await service.from("courses").select("*").eq("id", courseId).maybeSingle();
  if (error || !data) return null;
  return data;
}
