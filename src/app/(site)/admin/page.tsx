import Link from "next/link";
import { Users, BookOpen, Megaphone, GraduationCap, ClipboardList } from "lucide-react";
import { getAdminOverviewStats } from "@/lib/admin/overview";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const {
    studentCount,
    courseCount,
    announcementCount,
    enrollmentCount,
    submissionCount,
  } = await getAdminOverviewStats();

  const stats = [
    {
      label: "Students",
      value: studentCount,
      icon: Users,
      href: "/admin/students",
    },
    {
      label: "Courses",
      value: courseCount,
      icon: BookOpen,
      href: "/admin/courses",
    },
    {
      label: "Enrollments",
      value: enrollmentCount,
      icon: GraduationCap,
      href: "/admin/enrollments",
    },
    {
      label: "Announcements",
      value: announcementCount,
      icon: Megaphone,
      href: "/admin/announcements",
    },
    {
      label: "Submissions",
      value: submissionCount,
      icon: ClipboardList,
      href: "/admin/submissions",
    },
  ];

  return (
    <div>
      <DashboardHeader
        eyebrow="Academy control"
        title="Admin dashboard"
        description="Manage students, courses, and content for BAO Academy."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <PanelCard title="Quick actions" className="mt-6">
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/students">
            <Button>Enroll a student</Button>
          </Link>
          <Link href="/admin/courses/new">
            <Button variant="outline">New course</Button>
          </Link>
          <Link href="/admin/enrollments">
            <Button variant="outline">Enrollments</Button>
          </Link>
          <Link href="/admin/submissions">
            <Button variant="outline">Submissions</Button>
          </Link>
          <Link href="/admin/announcements">
            <Button variant="outline">Announcements</Button>
          </Link>
        </div>
      </PanelCard>
    </div>
  );
}
