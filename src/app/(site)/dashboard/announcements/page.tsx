import { requireStudent } from "@/lib/student/require-student";
import { getStudentAnnouncements } from "@/lib/student/queries";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PanelCard } from "@/components/dashboard/PanelCard";

export const dynamic = "force-dynamic";

export default async function DashboardAnnouncementsPage() {
  const { user } = await requireStudent();
  const announcements = await getStudentAnnouncements(user.id);

  return (
    <div>
      <DashboardHeader
        title="Announcements"
        description="Updates from your instructors and the academy team."
      />

      <div className="space-y-4">
        {announcements.length ? (
          announcements.map((a) => (
            <PanelCard key={a.id}>
              <p className="font-semibold text-[var(--foreground)]">{a.title}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-secondary">
                {a.body}
              </p>
              <p className="mt-3 text-xs text-muted">
                {new Date(a.published_at).toLocaleDateString(undefined, {
                  dateStyle: "long",
                })}
              </p>
            </PanelCard>
          ))
        ) : (
          <PanelCard>
            <p className="text-secondary">No announcements for your courses yet.</p>
          </PanelCard>
        )}
      </div>
    </div>
  );
}
