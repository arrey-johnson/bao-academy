import { getAdminServiceClient } from "@/lib/admin/db";

export type AdminEnrollmentRow = {
  id: string;
  progress_percent: number;
  enrolled_at: string;
  studentName: string | null;
  studentEmail: string | null;
  courseTitle: string | null;
  courseSlug: string | null;
};

export async function getAdminEnrollmentsList(): Promise<AdminEnrollmentRow[]> {
  const service = await getAdminServiceClient();

  const { data: enrollments, error } = await service
    .from("enrollments")
    .select("id, user_id, course_id, progress_percent, enrolled_at")
    .order("enrolled_at", { ascending: false });

  if (error) {
    console.error("[admin/enrollments] list:", error.message);
    return [];
  }

  if (!enrollments?.length) return [];

  const userIds = [...new Set(enrollments.map((e) => e.user_id))];
  const courseIds = [...new Set(enrollments.map((e) => e.course_id))];

  const [{ data: profiles }, { data: courses }] = await Promise.all([
    service.from("profiles").select("id, full_name, email").in("id", userIds),
    service.from("courses").select("id, title, slug").in("id", courseIds),
  ]);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
  const courseMap = new Map((courses ?? []).map((c) => [c.id, c]));

  return enrollments.map((e) => {
    const profile = profileMap.get(e.user_id);
    const course = courseMap.get(e.course_id);
    return {
      id: e.id,
      progress_percent: Number(e.progress_percent ?? 0),
      enrolled_at: e.enrolled_at,
      studentName: profile?.full_name ?? null,
      studentEmail: profile?.email ?? null,
      courseTitle: course?.title ?? null,
      courseSlug: course?.slug ?? null,
    };
  });
}

export async function getEnrollmentFormOptions() {
  const service = await getAdminServiceClient();

  const [{ data: students }, { data: courses }] = await Promise.all([
    service
      .from("profiles")
      .select("id, full_name, email")
      .eq("role", "student")
      .order("full_name", { ascending: true }),
    service.from("courses").select("id, title").order("title"),
  ]);

  return {
    students: students ?? [],
    courses: courses ?? [],
  };
}
