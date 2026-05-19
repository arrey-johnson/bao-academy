import { removeEnrollment } from "@/app/actions/admin";
import {
  getAdminEnrollmentsList,
  getEnrollmentFormOptions,
} from "@/lib/admin/enrollments";
import { AssignEnrollmentForm } from "@/components/admin/AssignEnrollmentForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { PanelCard } from "@/components/dashboard/PanelCard";

export const dynamic = "force-dynamic";

export default async function AdminEnrollmentsPage() {
  const [rows, { students, courses }] = await Promise.all([
    getAdminEnrollmentsList(),
    getEnrollmentFormOptions(),
  ]);

  return (
    <div>
      <DashboardHeader
        title="Enrollments"
        description="Assign students to courses and track progress."
      />

      <PanelCard title="Assign enrollment" className="mb-6">
        <AssignEnrollmentForm students={students} courses={courses} />
      </PanelCard>

      <PanelCard title="All enrollments" noPadding>
        <DataTable
          data={rows}
          getRowKey={(e) => e.id}
          emptyMessage="No enrollments yet. Assign a student to a course above."
          columns={[
            {
              key: "student",
              header: "Student",
              cell: (e) => (
                <span className="font-medium">
                  {e.studentName ?? e.studentEmail ?? "—"}
                </span>
              ),
            },
            {
              key: "email",
              header: "Email",
              cell: (e) => (
                <span className="text-secondary">{e.studentEmail ?? "—"}</span>
              ),
            },
            {
              key: "course",
              header: "Course",
              cell: (e) => e.courseTitle ?? "—",
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
