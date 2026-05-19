import Link from "next/link";
import { CheckCircle2, Circle, Flame, PlayCircle } from "lucide-react";
import { requireStudent } from "@/lib/student/require-student";
import { getStudentEnrollments, getCourseProgressDetail } from "@/lib/student/queries";
import { relationOne } from "@/lib/student/utils";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { StatCard } from "@/components/dashboard/StatCard";

export const dynamic = "force-dynamic";

type LessonRow = {
  id: string;
  title: string;
  slug: string;
  estimated_minutes: number;
  sort_order: number;
};

export default async function DashboardProgressPage() {
  const { profile, user } = await requireStudent();
  const enrollments = await getStudentEnrollments(user.id);

  return (
    <div>
      <DashboardHeader
        title="Your progress"
        description="Track lessons completed and course completion across your enrollments."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Day streak"
          value={profile.current_streak ?? 0}
          icon={Flame}
          accent
        />
        <StatCard
          label="Courses enrolled"
          value={enrollments.length}
          icon={CheckCircle2}
        />
      </div>

      {!enrollments.length ? (
        <PanelCard>
          <p className="text-secondary">
            No enrollments yet.{" "}
            <Link href="/dashboard/courses" className="text-bao-light hover:underline">
              Start a course
            </Link>
            .
          </p>
        </PanelCard>
      ) : (
        <div className="space-y-8">
          {await Promise.all(
            enrollments.map(async (e) => {
              const course = relationOne(
                e.courses as
                  | { id: string; title: string; slug: string }
                  | { id: string; title: string; slug: string }[]
                  | null
              );
              if (!course) return null;

              const { modules, progressMap, progressPercent } =
                await getCourseProgressDetail(user.id, course.id);

              return (
                <PanelCard key={e.id} title={course.title}>
                  <div className="mb-4">
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-secondary">Overall</span>
                      <span className="font-medium">{progressPercent}%</span>
                    </div>
                    <div className="progress-track h-2">
                      <div
                        className="progress-fill"
                        style={{ width: `${Math.min(progressPercent, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    {modules.map((mod) => (
                      <section key={mod.id}>
                        <h3 className="text-sm font-semibold text-bao-light">{mod.title}</h3>
                        <ul className="mt-3 space-y-2">
                          {(
                            (mod.lessons as LessonRow[]) ?? []
                          )
                            .sort((a, b) => a.sort_order - b.sort_order)
                            .map((lesson) => {
                              const prog = progressMap.get(lesson.id);
                              const Icon = prog?.is_completed
                                ? CheckCircle2
                                : prog && prog.current_slide_index > 0
                                  ? PlayCircle
                                  : Circle;
                              const iconClass = prog?.is_completed
                                ? "text-emerald-500"
                                : prog
                                  ? "text-bao-light"
                                  : "text-muted";

                              return (
                                <li key={lesson.id}>
                                  <Link
                                    href={`/learn/${course.slug}/${lesson.slug}`}
                                    className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-[var(--surface-muted)]"
                                  >
                                    <Icon className={`h-5 w-5 shrink-0 ${iconClass}`} />
                                    <span className="flex-1 font-medium">{lesson.title}</span>
                                    <span className="text-xs text-muted">
                                      {lesson.estimated_minutes} min
                                    </span>
                                  </Link>
                                </li>
                              );
                            })}
                        </ul>
                      </section>
                    ))}
                  </div>
                </PanelCard>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
