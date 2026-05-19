import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Circle, PlayCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCourseLessons } from "@/lib/data/courses";
import { getLessonProgressMap } from "@/lib/student/queries";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

type LessonRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  estimated_minutes: number;
  sort_order: number;
};

export default async function CoursePage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const data = await getCourseLessons(courseSlug);
  if (!data) notFound();

  const { course, modules } = data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const lessonIds = modules.flatMap((m) =>
    ((m.lessons as LessonRow[]) ?? []).map((l) => l.id)
  );

  const progressMap = user
    ? await getLessonProgressMap(user.id, lessonIds)
    : new Map<string, { is_completed: boolean; current_slide_index: number }>();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">{course.title}</h1>
      <p className="mt-2 text-zinc-500">Pick a lesson to continue</p>
      {!user && (
        <p className="mt-4 text-sm text-bao-light">
          <Link href={`/login?redirect=/learn/${courseSlug}`} className="hover:underline">
            Sign in
          </Link>{" "}
          to save progress.
        </p>
      )}

      <div className="mt-10 space-y-8">
        {modules.map((mod) => (
          <section key={mod.id}>
            <h2 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
              {mod.title}
            </h2>
            <ul className="mt-4 space-y-3">
              {((mod.lessons as LessonRow[]) ?? [])
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
                      ? "text-bao"
                      : "text-zinc-300";

                  return (
                    <li key={lesson.id}>
                      <Link href={`/learn/${courseSlug}/${lesson.slug}`}>
                        <Card className="flex items-center gap-4 transition-colors hover:border-bao/40">
                          <Icon className={`h-5 w-5 shrink-0 ${iconClass}`} />
                          <div className="flex-1">
                            <p className="font-medium">{lesson.title}</p>
                            {lesson.description && (
                              <p className="mt-1 line-clamp-1 text-sm text-zinc-500">
                                {lesson.description}
                              </p>
                            )}
                          </div>
                          <span className="text-xs text-zinc-400">
                            {lesson.estimated_minutes} min
                          </span>
                        </Card>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
