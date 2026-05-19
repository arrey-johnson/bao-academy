import Link from "next/link";
import { notFound } from "next/navigation";
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

  return (
    <div>
      <DashboardHeader
        title={course.title}
        description={`/${course.slug}`}
        action={
          <div className="flex flex-wrap gap-2">
            <TogglePublishedButton courseId={course.id} published={course.published} />
            <Link href={`/learn/${course.slug}`}>
              <Button variant="outline" size="sm">
                Preview
              </Button>
            </Link>
            <Link href="/admin/courses" className="self-center text-sm text-secondary hover:text-[var(--foreground)]">
              ← Courses
            </Link>
          </div>
        }
      />

      <PanelCard title="Course settings" className="mb-6">
        <CourseForm course={course} />
      </PanelCard>

      <PanelCard title="Curriculum" className="mb-6">
        <AddModuleForm courseId={course.id} />
        <div className="mt-6 space-y-4">
          {moduleRows.map((m) => (
            <ModuleBlock
              key={m.id}
              moduleId={m.id}
              title={m.title}
              lessons={m.lessons ?? []}
              courseId={course.id}
            />
          ))}
          {!moduleRows.length && (
            <p className="text-sm text-muted">Add a module to start building curriculum.</p>
          )}
        </div>
      </PanelCard>

      <PanelCard title="Danger zone">
        <DeleteButton
          label="Delete course"
          confirmMessage="Delete this course and all modules, lessons, and slides?"
          onDelete={() => deleteCourse(course.id)}
          redirectTo="/admin/courses"
        />
      </PanelCard>
    </div>
  );
}
