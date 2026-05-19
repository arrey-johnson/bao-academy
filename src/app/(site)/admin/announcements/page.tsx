import { getAdminAnnouncementsPageData } from "@/lib/admin/announcements";
import { AnnouncementForm } from "@/components/admin/AnnouncementForm";
import { AnnouncementList } from "@/components/admin/AnnouncementList";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PanelCard } from "@/components/dashboard/PanelCard";

export const dynamic = "force-dynamic";

export default async function AdminAnnouncementsPage() {
  const { announcements, courses } = await getAdminAnnouncementsPageData();

  return (
    <div>
      <DashboardHeader
        title="Announcements"
        description="Messages shown on the student dashboard home."
      />

      <PanelCard title="New announcement" className="mb-6">
        <AnnouncementForm courses={courses} />
      </PanelCard>

      <AnnouncementList announcements={announcements} courses={courses} />
    </div>
  );
}
