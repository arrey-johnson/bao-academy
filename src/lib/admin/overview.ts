import { getAdminServiceClient } from "@/lib/admin/db";

export async function getAdminOverviewStats() {
  const service = await getAdminServiceClient();

  const [
    { count: studentCount },
    { count: courseCount },
    { count: announcementCount },
    { count: enrollmentCount },
    { count: submissionCount },
  ] = await Promise.all([
    service
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "student"),
    service.from("courses").select("*", { count: "exact", head: true }),
    service.from("announcements").select("*", { count: "exact", head: true }),
    service.from("enrollments").select("*", { count: "exact", head: true }),
    service
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .neq("status", "draft"),
  ]);

  return {
    studentCount: studentCount ?? 0,
    courseCount: courseCount ?? 0,
    announcementCount: announcementCount ?? 0,
    enrollmentCount: enrollmentCount ?? 0,
    submissionCount: submissionCount ?? 0,
  };
}
