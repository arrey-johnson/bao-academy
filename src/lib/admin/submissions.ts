import { getAdminServiceClient } from "@/lib/admin/db";

export type AdminSubmissionRow = {
  id: string;
  status: string;
  github_url: string | null;
  deploy_url: string | null;
  submitted_at: string | null;
  created_at: string;
  studentName: string | null;
  studentEmail: string | null;
  assignmentTitle: string | null;
};

export async function getAdminSubmissionsList(): Promise<AdminSubmissionRow[]> {
  const service = await getAdminServiceClient();

  const { data: submissions, error } = await service
    .from("submissions")
    .select("id, user_id, assignment_id, status, github_url, deploy_url, submitted_at, created_at, updated_at")
    .neq("status", "draft")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("[admin/submissions] list:", error.message);
    return [];
  }

  if (!submissions?.length) return [];

  const userIds = [...new Set(submissions.map((s) => s.user_id))];
  const assignmentIds = [...new Set(submissions.map((s) => s.assignment_id))];

  const [{ data: profiles }, { data: assignments }] = await Promise.all([
    service.from("profiles").select("id, full_name, email").in("id", userIds),
    service.from("assignments").select("id, title").in("id", assignmentIds),
  ]);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
  const assignmentMap = new Map((assignments ?? []).map((a) => [a.id, a]));

  return submissions.map((s) => {
    const profile = profileMap.get(s.user_id);
    const assignment = assignmentMap.get(s.assignment_id);
    return {
      id: s.id,
      status: s.status,
      github_url: s.github_url,
      deploy_url: s.deploy_url,
      submitted_at: s.submitted_at,
      created_at: s.created_at,
      studentName: profile?.full_name ?? null,
      studentEmail: profile?.email ?? null,
      assignmentTitle: assignment?.title ?? null,
    };
  });
}
