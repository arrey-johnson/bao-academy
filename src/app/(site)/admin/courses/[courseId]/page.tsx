import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Settings } from "lucide-react";
import { deleteCourse } from "@/app/actions/admin";
import { getCourseWithCurriculum } from "@/lib/admin/queries";
import { AddModuleForm, ModuleBlock } from "@/components/admin/CurriculumForms";
import { CourseForm } from "@/components/admin/CourseForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { TogglePublishedButton } from "@/components/admin/TogglePublishedButton";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ courseId: string }> };

type LessonRow = { id: string; title: string; slug: string; sort_order: number };
type ModuleRow = {
  id: string;
  title: string;
  slug: string;
  sort_order: number;
  lessons: LessonRow[] | null;
};

export default async function AdminCourseDetailPage({ params }: Props) {
  const { courseId } = await params;
  const data = await getCourseWithCurriculum(courseId);
  if (!data) notFound();

  const { course, modules } = data;
  const moduleRows = modules as ModuleRow[];
  const lessonCount = moduleRows.reduce((n, m) => n + (m.lessons?.length ?? 0), 0);

  return (
    <div>
      <DashboardHeader
        title={course.title}
        description={`Manage settings and curriculum · /learn/${course.slug}`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <span className={course.published ? "badge badge-accent" : "badge"}>
              {course.published ? "Published" : "Draft"}
            </span>
            <TogglePublishedButton courseId={course.id} published={course.published} />
            <Link href={`/learn/${course.slug}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                Preview
              </Button>
            </Link>
            <Link
              href="/admin/courses"
              className="text-sm text-secondary hover:text-[var(--foreground)]"
            >
              ← All courses
            </Link>
          </div>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <PanelCard className="!p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">Modules</p>
          <p className="mt-1 text-2xl font-bold">{moduleRows.length}</p>
        </PanelCard>
        <PanelCard className="!p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">Lessons</p>
          <p className="mt-1 text-2xl font-bold">{lessonCount}</p>
        </PanelCard>
        <PanelCard className="!p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">Sort order</p>
          <p className="mt-1 text-2xl font-bold">{course.sort_order}</p>
        </PanelCard>
      </div>

      <PanelCard
        title="Course settings"
        description="Title, slug, description, track, and publish status"
        icon={<Settings className="h-4 w-4 text-bao-light" />}
        className="mb-6"
      >
        <CourseForm course={course} />
      </PanelCard>

      <PanelCard
        title="Curriculum"
        description="Modules and lessons — click a lesson to edit slides"
        icon={<BookOpen className="h-4 w-4 text-bao-light" />}
        className="mb-6"
      >
        <AddModuleForm courseId={course.id} />
        <div className="mt-6 space-y-4">
          {moduleRows.length ? (
            moduleRows.map((m) => (
              <ModuleBlock
                key={m.id}
                moduleId={m.id}
                title={m.title}
                lessons={m.lessons ?? []}
                courseId={course.id}
              />
            ))
          ) : (
            <p className="rounded-xl border border-dashed border-[var(--border)] px-4 py-8 text-center text-sm text-muted">
              No modules yet. Add a module above, then add lessons inside it.
            </p>
          )}
        </div>
      </PanelCard>

      <PanelCard title="Danger zone">
        <p className="mb-4 text-sm text-secondary">
          Permanently deletes this course and all modules, lessons, slides, and enrollments.
        </p>
        <DeleteButton
          label="Delete course"
          confirmMessage={`Delete "${course.title}" and all its content?`}
          onDelete={() => deleteCourse(course.id)}
          redirectTo="/admin/courses"
        />
      </PanelCard>
    </div>
  );
}
