import { requireStudent } from "@/lib/student/require-student";
import {
  getPublishedCourses,
  getStudentEnrollments,
} from "@/lib/student/queries";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { StartCourseButton } from "@/components/student/StartCourseButton";
import { relationOne } from "@/lib/student/utils";

export const dynamic = "force-dynamic";

export default async function DashboardCoursesPage() {
  const { user } = await requireStudent();
  const [courses, enrollments] = await Promise.all([
    getPublishedCourses(),
    getStudentEnrollments(user.id),
  ]);

  const enrolledIds = new Set(
    enrollments
      .map((e) => relationOne(e.courses as { id: string } | { id: string }[] | null)?.id)
      .filter(Boolean) as string[]
  );

  return (
    <div>
      <DashboardHeader
        title="My courses"
        description="Courses you are enrolled in and available tracks to start."
      />

      {enrollments.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-bao-light">
            Enrolled
          </h2>
          <div className="space-y-4">
            {enrollments.map((e) => {
              const course = relationOne(
                e.courses as
                  | { id: string; title: string; slug: string; description: string | null }
                  | { id: string; title: string; slug: string; description: string | null }[]
                  | null
              );
              if (!course) return null;
              return (
                <PanelCard key={e.id}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{course.title}</h3>
                      {course.description && (
                        <p className="mt-1 text-sm text-secondary line-clamp-2">
                          {course.description}
                        </p>
                      )}
                      <p className="mt-3 text-sm text-muted">
                        Progress: {Number(e.progress_percent)}%
                      </p>
                      <div className="progress-track mt-2 h-2 max-w-xs">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${Math.min(Number(e.progress_percent), 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                    <StartCourseButton
                      courseId={course.id}
                      courseSlug={course.slug}
                      enrolled
                    />
                  </div>
                </PanelCard>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-bao-light">
          {enrollments.length ? "More courses" : "Available courses"}
        </h2>
        <div className="space-y-4">
          {courses
            .filter((c) => !enrolledIds.has(c.id))
            .map((c) => (
              <PanelCard key={c.id}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{c.title}</h3>
                    {c.description && (
                      <p className="mt-1 text-sm text-secondary line-clamp-2">
                        {c.description}
                      </p>
                    )}
                  </div>
                  <StartCourseButton
                    courseId={c.id}
                    courseSlug={c.slug}
                    enrolled={false}
                  />
                </div>
              </PanelCard>
            ))}
          {!courses.filter((c) => !enrolledIds.has(c.id)).length && enrollments.length > 0 && (
            <p className="text-sm text-muted">You are enrolled in all published courses.</p>
          )}
          {!courses.length && (
            <PanelCard>
              <p className="text-secondary">No published courses yet.</p>
            </PanelCard>
          )}
        </div>
      </section>
    </div>
  );
}
