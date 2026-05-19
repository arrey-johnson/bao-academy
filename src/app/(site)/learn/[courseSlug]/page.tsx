import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { getCourseLessons } from "@/lib/data/courses";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const data = await getCourseLessons(courseSlug);
  if (!data) notFound();

  const { course, modules } = data;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">{course.title}</h1>
      <p className="mt-2 text-zinc-500">Pick a lesson to continue</p>

      <div className="mt-10 space-y-8">
        {modules.map((mod) => (
          <section key={mod.id}>
            <h2 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
              {mod.title}
            </h2>
            <ul className="mt-4 space-y-3">
              {(mod.lessons as { id: string; title: string; slug: string; description: string | null; estimated_minutes: number; sort_order: number }[])
                ?.sort((a, b) => a.sort_order - b.sort_order)
                .map((lesson) => (
                  <li key={lesson.id}>
                    <Link href={`/learn/${courseSlug}/${lesson.slug}`}>
                      <Card className="flex items-center gap-4 transition-colors hover:border-bao/40">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-zinc-300" />
                        <div className="flex-1">
                          <p className="font-medium">{lesson.title}</p>
                          {lesson.description && (
                            <p className="mt-1 text-sm text-zinc-500 line-clamp-1">
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
                ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
