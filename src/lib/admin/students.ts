import { getAdminServiceClient } from "@/lib/admin/db";

export async function getAdminStudentsPageData() {
  const service = await getAdminServiceClient();

  const [{ data: students }, { data: courses }] = await Promise.all([
    service
      .from("profiles")
      .select("id, email, full_name, role, current_streak, created_at")
      .order("created_at", { ascending: false }),
    service.from("courses").select("id, title").order("title"),
  ]);

  return {
    students: students ?? [],
    courses: courses ?? [],
  };
}

export type AdminStudentEnrollmentRow = {
  id: string;
  progress_percent: number;
  enrolled_at: string;
  courseTitle: string | null;
  courseSlug: string | null;
};

export async function getAdminStudentDetail(studentId: string) {
  const service = await getAdminServiceClient();

  const { data: student, error } = await service
    .from("profiles")
    .select("id, email, full_name, role, current_streak, created_at")
    .eq("id", studentId)
    .maybeSingle();

  if (error || !student) return null;

  const [{ data: enrollments }, { data: courses }] = await Promise.all([
    service
      .from("enrollments")
      .select("id, course_id, progress_percent, enrolled_at")
      .eq("user_id", studentId)
      .order("enrolled_at", { ascending: false }),
    service.from("courses").select("id, title").order("title"),
  ]);

  const courseIds = [...new Set((enrollments ?? []).map((e) => e.course_id))];
  let courseMap = new Map<string, { id: string; title: string; slug: string }>();

  if (courseIds.length) {
    const { data: courseRows } = await service
      .from("courses")
      .select("id, title, slug")
      .in("id", courseIds);
    courseMap = new Map((courseRows ?? []).map((c) => [c.id, c]));
  }

  const enrollmentRows: AdminStudentEnrollmentRow[] = (enrollments ?? []).map((e) => {
    const course = courseMap.get(e.course_id);
    return {
      id: e.id,
      progress_percent: Number(e.progress_percent ?? 0),
      enrolled_at: e.enrolled_at,
      courseTitle: course?.title ?? null,
      courseSlug: course?.slug ?? null,
    };
  });

  return {
    student,
    enrollments: enrollmentRows,
    courses: courses ?? [],
  };
}
