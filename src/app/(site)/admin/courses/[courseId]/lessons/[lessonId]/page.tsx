import Link from "next/link";
import { notFound } from "next/navigation";
import { getLessonWithSlides } from "@/lib/admin/queries";
import { LessonSlidesPanel } from "@/components/admin/LessonSlidesPanel";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PanelCard } from "@/components/dashboard/PanelCard";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ courseId: string; lessonId: string }> };

export default async function AdminLessonEditorPage({ params }: Props) {
  const { courseId, lessonId } = await params;
  const data = await getLessonWithSlides(lessonId);
  if (!data) notFound();

  const { lesson, slides } = data;
  const mod = lesson.modules as {
    id: string;
    title: string;
    courses: { id: string; title: string; slug: string } | null;
  } | null;
  const course = mod?.courses;

  return (
    <div>
      <DashboardHeader
        title={lesson.title}
        description={lesson.description ?? "Edit slides for this lesson."}
        action={
          <Link
            href={`/admin/courses/${courseId}`}
            className="text-sm text-secondary hover:text-[var(--foreground)]"
          >
            ← {course?.title ?? "Course"}
          </Link>
        }
      />

      {course && (
        <p className="mb-4 text-sm text-muted">
          Student path: /learn/{course.slug}/…/{lesson.slug}
        </p>
      )}

      <PanelCard title="Slides">
        <LessonSlidesPanel lessonId={lessonId} slides={slides} />
      </PanelCard>
    </div>
  );
}
