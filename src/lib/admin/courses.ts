import { createClient } from "@/lib/supabase/server";

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
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select(
      `
      id,
      title,
      slug,
      description,
      track,
      published,
      sort_order,
      created_at,
      modules(count),
      enrollments(count)
    `
    )
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[admin/courses] list:", error.message);
    return [];
  }

  return (data ?? []).map((row) => {
    const modules = row.modules as { count: number }[] | { count: number } | null;
    const enrollments = row.enrollments as { count: number }[] | { count: number } | null;
    const moduleCount = Array.isArray(modules) ? (modules[0]?.count ?? 0) : (modules?.count ?? 0);
    const enrollmentCount = Array.isArray(enrollments)
      ? (enrollments[0]?.count ?? 0)
      : (enrollments?.count ?? 0);

    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.description,
      track: row.track,
      published: row.published,
      sort_order: row.sort_order,
      created_at: row.created_at,
      moduleCount,
      enrollmentCount,
    };
  });
}

export async function getAdminCourseById(courseId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("courses").select("*").eq("id", courseId).maybeSingle();
  if (error || !data) return null;
  return data;
}
