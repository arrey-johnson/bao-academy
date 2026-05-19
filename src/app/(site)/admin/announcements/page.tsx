import { createClient } from "@/lib/supabase/server";
import { AnnouncementForm } from "@/components/admin/AnnouncementForm";
import { AnnouncementList } from "@/components/admin/AnnouncementList";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PanelCard } from "@/components/dashboard/PanelCard";

export const dynamic = "force-dynamic";

export default async function AdminAnnouncementsPage() {
  const supabase = await createClient();
  const [{ data: announcements }, { data: courses }] = await Promise.all([
    supabase.from("announcements").select("*").order("published_at", { ascending: false }),
    supabase.from("courses").select("id, title").order("title"),
  ]);

  return (
    <div>
      <DashboardHeader
        title="Announcements"
        description="Messages shown on the student dashboard home."
      />

      <PanelCard title="New announcement" className="mb-6">
        <AnnouncementForm courses={courses ?? []} />
      </PanelCard>

      <AnnouncementList announcements={announcements ?? []} courses={courses ?? []} />
    </div>
  );
}
