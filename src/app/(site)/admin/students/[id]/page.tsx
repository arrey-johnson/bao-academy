import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deleteStudent } from "@/app/actions/admin";
import { AssignEnrollmentForm } from "@/components/admin/AssignEnrollmentForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { StudentEditForm } from "@/components/admin/StudentEditForm";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { removeEnrollment } from "@/app/actions/admin";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminStudentDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: student } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, current_streak, created_at")
    .eq("id", id)
    .maybeSingle();

  if (!student) notFound();

  const [{ data: enrollments }, { data: courses }] = await Promise.all([
    supabase
      .from("enrollments")
      .select("id, progress_percent, enrolled_at, courses(id, title, slug)")
      .eq("user_id", id)
      .order("enrolled_at", { ascending: false }),
    supabase.from("courses").select("id, title").order("title"),
  ]);

  type EnrollmentRow = {
    id: string;
    progress_percent: number;
    enrolled_at: string;
    courses: { id: string; title: string; slug: string } | null;
  };

  const rows = (enrollments ?? []) as unknown as EnrollmentRow[];

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
        <StudentEditForm student={student} />
      </PanelCard>

      <PanelCard title="Enroll in course" className="mb-6">
        <AssignEnrollmentForm
          students={[{ id: student.id, full_name: student.full_name, email: student.email }]}
          courses={courses ?? []}
        />
      </PanelCard>

      <PanelCard title="Enrollments" noPadding className="mb-6">
        <DataTable
          data={rows}
          getRowKey={(e) => e.id}
          emptyMessage="Not enrolled in any course yet."
          columns={[
            {
              key: "course",
              header: "Course",
              cell: (e) => (
                <span className="font-medium">{e.courses?.title ?? "—"}</span>
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
                  onDelete={() => removeEnrollment(e.id)}
                />
              ),
            },
          ]}
        />
      </PanelCard>

      <PanelCard title="Danger zone">
        <p className="mb-4 text-sm text-secondary">
          Permanently deletes the auth account and profile. Cannot be undone.
        </p>
        <DeleteButton
          label="Delete student"
          confirmMessage="Delete this student permanently?"
          onDelete={() => deleteStudent(id)}
          redirectTo="/admin/students"
        />
      </PanelCard>
    </div>
  );
}
