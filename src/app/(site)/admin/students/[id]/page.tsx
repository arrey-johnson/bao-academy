import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteStudent, removeEnrollment } from "@/app/actions/admin";
import { requireAdmin } from "@/lib/auth/require-admin";
import { PROTECTED_ACCOUNT_ROLES } from "@/lib/auth/roles";
import { getAdminStudentDetail } from "@/lib/admin/students";
import { AssignEnrollmentForm } from "@/components/admin/AssignEnrollmentForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { StudentEditForm } from "@/components/admin/StudentEditForm";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { PanelCard } from "@/components/dashboard/PanelCard";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminStudentDetailPage({ params }: Props) {
  const { id } = await params;
  const { isSuperAdmin } = await requireAdmin();
  const data = await getAdminStudentDetail(id);
  if (!data) notFound();

  const { student, enrollments, courses } = data;
  const isProtectedAccount = PROTECTED_ACCOUNT_ROLES.includes(
    student.role as (typeof PROTECTED_ACCOUNT_ROLES)[number]
  );

  if (!isSuperAdmin && isProtectedAccount) {
    return (
      <div>
        <DashboardHeader
          title={student.full_name ?? student.email ?? "Account"}
          description="This account can only be managed by a super admin."
          action={
            <Link
              href="/admin/students"
              className="text-sm text-secondary hover:text-[var(--foreground)]"
            >
              ← All students
            </Link>
          }
        />
        <PanelCard>
          <p className="text-secondary">
            You do not have permission to edit staff or admin accounts.
          </p>
        </PanelCard>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader
        title={student.full_name ?? student.email ?? "Student"}
        description={student.email ?? undefined}
        action={
          <Link href="/admin/students" className="text-sm text-secondary hover:text-[var(--foreground)]">
            ← All students
          </Link>
        }
      />

      <PanelCard title="Profile & access" className="mb-6">
        <StudentEditForm student={student} isSuperAdmin={isSuperAdmin} />
      </PanelCard>

      <PanelCard title="Enroll in course" className="mb-6">
        <AssignEnrollmentForm
          students={[{ id: student.id, full_name: student.full_name, email: student.email }]}
          courses={courses}
        />
      </PanelCard>

      <PanelCard title="Enrollments" noPadding className="mb-6">
        <DataTable
          data={enrollments}
          getRowKey={(e) => e.id}
          emptyMessage="Not enrolled in any course yet."
          columns={[
            {
              key: "course",
              header: "Course",
              cell: (e) => (
                <span className="font-medium">{e.courseTitle ?? "—"}</span>
              ),
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
                  onDelete={removeEnrollment.bind(null, e.id)}
                />
              ),
            },
          ]}
        />
      </PanelCard>

      {isSuperAdmin && (
        <PanelCard title="Danger zone">
          <p className="mb-4 text-sm text-secondary">
            Permanently deletes the auth account and profile. Cannot be undone.
          </p>
          <DeleteButton
            label="Delete student"
            confirmMessage="Delete this student permanently?"
            onDelete={deleteStudent.bind(null, id)}
            redirectTo="/admin/students"
          />
        </PanelCard>
      )}
    </div>
  );
}
