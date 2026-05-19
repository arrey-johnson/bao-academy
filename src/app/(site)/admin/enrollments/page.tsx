import { createClient } from "@/lib/supabase/server";
import { removeEnrollment } from "@/app/actions/admin";
import { AssignEnrollmentForm } from "@/components/admin/AssignEnrollmentForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { PanelCard } from "@/components/dashboard/PanelCard";

export const dynamic = "force-dynamic";

type EnrollmentRow = {
  id: string;
  progress_percent: number;
  enrolled_at: string;
  profiles: { full_name: string | null; email: string | null } | null;
  courses: { title: string; slug: string } | null;
};

export default async function AdminEnrollmentsPage() {
  const supabase = await createClient();

  const [{ data: enrollments }, { data: students }, { data: courses }] =
    await Promise.all([
      supabase
        .from("enrollments")
        .select(
          "id, progress_percent, enrolled_at, profiles(full_name, email), courses(title, slug)"
        )
        .order("enrolled_at", { ascending: false }),
      supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("role", "student")
        .order("full_name"),
      supabase.from("courses").select("id, title").order("title"),
    ]);

  const rows = (enrollments ?? []) as unknown as EnrollmentRow[];

  return (
    <div>
      <DashboardHeader
        title="Enrollments"
        description="Assign students to courses and track progress."
      />

      <PanelCard title="Assign enrollment" className="mb-6">
        <AssignEnrollmentForm students={students ?? []} courses={courses ?? []} />
      </PanelCard>

      <PanelCard title="All enrollments" noPadding>
        <DataTable
          data={rows}
          getRowKey={(e) => e.id}
          emptyMessage="No enrollments yet."
          columns={[
            {
              key: "student",
              header: "Student",
              cell: (e) => (
                <span className="font-medium">
                  {e.profiles?.full_name ?? e.profiles?.email ?? "—"}
                </span>
              ),
            },
            {
              key: "email",
              header: "Email",
              cell: (e) => (
                <span className="text-secondary">{e.profiles?.email ?? "—"}</span>
              ),
            },
            {
              key: "course",
              header: "Course",
              cell: (e) => e.courses?.title ?? "—",
            },
            {
              key: "progress",
              header: "Progress",
              cell: (e) => `${e.progress_percent}%`,
            },
            {
              key: "enrolled",
              header: "Enrolled",
              cell: (e) =>
                new Date(e.enrolled_at).toLocaleDateString(undefined, {
                  dateStyle: "medium",
                }),
            },
            {
              key: "actions",
              header: "",
              cell: (e) => (
                <DeleteButton
                  label="Remove"
                  confirmMessage="Remove this enrollment?"
                  onDelete={() => removeEnrollment(e.id)}
                />
              ),
            },
          ]}
        />
      </PanelCard>
    </div>
  );
}
