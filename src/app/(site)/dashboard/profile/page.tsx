import { requireStudent } from "@/lib/student/require-student";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { ProfileForm } from "@/components/student/ProfileForm";

export const dynamic = "force-dynamic";

export default async function DashboardProfilePage() {
  const { profile } = await requireStudent();

  return (
    <div>
      <DashboardHeader
        title="Profile"
        description="Update how you appear in the academy and change your password."
      />

      <PanelCard>
        <ProfileForm
          fullName={profile.full_name ?? ""}
          email={profile.email ?? ""}
        />
      </PanelCard>
    </div>
  );
}
