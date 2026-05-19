import { getAdminServiceClient } from "@/lib/admin/db";

export async function getAdminAnnouncementsPageData() {
  const service = await getAdminServiceClient();

  const [{ data: announcements }, { data: courses }] = await Promise.all([
    service.from("announcements").select("*").order("published_at", { ascending: false }),
    service.from("courses").select("id, title").order("title"),
  ]);

  return {
    announcements: announcements ?? [],
    courses: courses ?? [],
  };
}
