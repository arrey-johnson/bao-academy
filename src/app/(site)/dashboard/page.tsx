import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ClipboardList,
  Flame,
  Megaphone,
  Sparkles,
} from "lucide-react";
import {
  getContinueLesson,
  getFirstLessonSlug,
  getPrimaryEnrollment,
  getStudentAnnouncements,
  getStudentAssignments,
} from "@/lib/student/queries";
import { relationOne } from "@/lib/student/utils";
import { requireStudent } from "@/lib/student/require-student";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/student/StatusBadge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { profile, user } = await requireStudent();

  const primary = await getPrimaryEnrollment(user.id);
  const course = relationOne(
    primary?.courses as
      | { id: string; title: string; slug: string; description: string | null }
      | { id: string; title: string; slug: string; description: string | null }[]
      | null
  );

  const lastLesson = await getContinueLesson(user.id, primary?.last_lesson_id ?? null);
  const firstLessonSlug = course ? await getFirstLessonSlug(course.id) : null;
  const continueSlug = lastLesson?.slug ?? firstLessonSlug ?? "css-flexbox";
  const progress = Number(primary?.progress_percent ?? 0);

  const [announcements, assignments] = await Promise.all([
    getStudentAnnouncements(user.id, 3),
    getStudentAssignments(user.id),
  ]);

  const pendingAssignments = assignments.filter(
    (a) => !a.submission || a.submission.status === "draft"
  );
  const needsRevision = assignments.filter(
    (a) => a.submission?.status === "needs_revision"
  );

  const firstName = profile.full_name?.split(" ")[0] ?? "builder";

  return (
    <div>
      <DashboardHeader
        eyebrow="Your workspace"
        title={`Hey, ${firstName} 👋`}
        description="Pick up where you left off — ship another lesson today."
      />

      {!course ? (
        <PanelCard accent className="mb-6">
          <p className="text-secondary">
            You are not enrolled in a course yet. Browse available courses and start learning.
          </p>
          <Link href="/dashboard/courses" className="mt-4 inline-block">
            <Button>Browse courses</Button>
          </Link>
        </PanelCard>
      ) : (
        <div className="grid gap-5 md:grid-cols-3">
          <PanelCard accent className="md:col-span-2">
            <p className="flex items-center gap-2 text-sm font-semibold text-bao-light">
              <Sparkles className="h-4 w-4" />
              Continue learning
            </p>
            <h2 className="mt-3 text-2xl font-bold text-[var(--foreground)]">
              {lastLesson?.title ?? "Start your first lesson"}
            </h2>
            <p className="mt-1 text-secondary">{course.title}</p>
            <div className="mt-6">
              <div className="mb-2 flex justify-between text-xs">
                <span className="text-secondary">Course progress</span>
                <span className="font-medium text-[var(--foreground)]">{progress}%</span>
              </div>
              <div className="progress-track h-2.5">
                <div
                  className="progress-fill"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
            <Link
              href={`/learn/${course.slug}/${continueSlug}`}
              className="mt-8 inline-block"
            >
              <Button size="lg" className="gap-2">
                Continue lesson
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </PanelCard>

          <StatCard
            label="Day streak"
            value={profile.current_streak ?? 0}
            icon={Flame}
            sublabel="Keep it going!"
            href="/dashboard/progress"
            accent
          />
        </div>
      )}

      {(pendingAssignments.length > 0 || needsRevision.length > 0) && (
        <PanelCard
          title="Assignments"
          className="mt-6"
          icon={<ClipboardList className="h-4 w-4 text-bao-light" />}
        >
          <ul className="space-y-3">
            {needsRevision.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium">{a.title}</span>
                <div className="flex items-center gap-2">
                  <StatusBadge status="needs_revision" />
                  <Link href={`/dashboard/assignments/${a.id}`}>
                    <Button size="sm" variant="outline">
                      Revise
                    </Button>
                  </Link>
                </div>
              </li>
            ))}
            {pendingAssignments.slice(0, 3).map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium">{a.title}</span>
                <Link href={`/dashboard/assignments/${a.id}`}>
                  <Button size="sm">Submit work</Button>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/dashboard/assignments"
            className="mt-4 inline-block text-sm text-bao-light hover:underline"
          >
            View all assignments →
          </Link>
        </PanelCard>
      )}

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <PanelCard
          title="Active course"
          description={course?.description ?? undefined}
          icon={<BookOpen className="h-4 w-4 text-bao-light" />}
        >
          <h3 className="text-lg font-semibold text-[var(--foreground)]">
            {course?.title ?? "No course yet"}
          </h3>
          {course ? (
            <Link href={`/learn/${course.slug}`} className="mt-5 inline-block">
              <Button variant="outline" size="sm">
                View curriculum
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard/courses" className="mt-5 inline-block">
              <Button variant="outline" size="sm">
                Browse courses
              </Button>
            </Link>
          )}
        </PanelCard>

        <PanelCard
          title="Announcements"
          icon={<Megaphone className="h-4 w-4 text-bao-light" />}
        >
          <ul className="space-y-4">
            {announcements.length ? (
              announcements.map((a) => (
                <li
                  key={a.id}
                  className="border-b border-[var(--surface-border)] pb-4 last:border-0 last:pb-0"
                >
                  <p className="font-medium text-[var(--foreground)]">{a.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-secondary">{a.body}</p>
                </li>
              ))
            ) : (
              <li className="text-sm text-muted">No announcements yet.</li>
            )}
          </ul>
          <Link
            href="/dashboard/announcements"
            className="mt-4 inline-block text-sm text-bao-light hover:underline"
          >
            See all →
          </Link>
        </PanelCard>
      </div>
    </div>
  );
}
