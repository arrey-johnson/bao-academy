import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { EnrollStudentForm } from "@/components/admin/EnrollStudentForm";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

type StudentRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string;
  current_streak: number | null;
};

export default async function AdminStudentsPage() {
  const supabase = await createClient();
  const [{ data: students }, { data: courses }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email, full_name, role, current_streak, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("courses").select("id, title").order("title"),
  ]);

  const rows = (students ?? []) as StudentRow[];

  return (
    <div>
      <DashboardHeader
        title="Students"
        description="Enroll learners and manage accounts. Public sign-up is disabled."
      />

      <PanelCard
        title="Enroll new student"
        description="Creates their login credentials — they sign in at /login."
        className="mb-6"
      >
        <EnrollStudentForm courses={courses ?? []} />
      </PanelCard>

      <PanelCard title="All accounts" noPadding>
        <DataTable
          data={rows}
          getRowKey={(s) => s.id}
          emptyMessage="No profiles yet. Enroll a student above or run supabase/full-setup.sql."
          columns={[
            {
              key: "name",
              header: "Name",
              cell: (s) => (
                <Link
                  href={`/admin/students/${s.id}`}
                  className="font-medium hover:text-bao-light"
                >
                  {s.full_name ?? "—"}
                </Link>
              ),
            },
            {
              key: "email",
              header: "Email",
              cell: (s) => <span className="text-secondary">{s.email}</span>,
            },
            {
              key: "role",
              header: "Role",
              cell: (s) => <span className="badge capitalize">{s.role}</span>,
            },
            {
              key: "streak",
              header: "Streak",
              cell: (s) => s.current_streak ?? 0,
            },
            {
              key: "actions",
              header: "",
              cell: (s) => (
                <Link href={`/admin/students/${s.id}`}>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </Link>
              ),
            },
          ]}
        />
      </PanelCard>
    </div>
  );
}
