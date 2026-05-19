import Link from "next/link";
import { Bookmark } from "lucide-react";
import { requireStudent } from "@/lib/student/require-student";
import { getStudentBookmarks } from "@/lib/student/queries";
import { relationOne } from "@/lib/student/utils";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function DashboardBookmarksPage() {
  const { user } = await requireStudent();
  const bookmarks = await getStudentBookmarks(user.id);

  return (
    <div>
      <DashboardHeader
        title="Bookmarks"
        description="Slides you saved while learning — jump back to review key concepts."
      />

      <div className="space-y-4">
        {bookmarks.length ? (
          bookmarks.map((b) => {
            const lesson = relationOne(b.lessons as {
              id: string;
              title: string;
              slug: string;
              modules:
                | { courses: { title: string; slug: string } | { title: string; slug: string }[] | null }
                | { courses: { title: string; slug: string } | { title: string; slug: string }[] | null }[]
                | null;
            } | {
              id: string;
              title: string;
              slug: string;
              modules:
                | { courses: { title: string; slug: string } | { title: string; slug: string }[] | null }
                | { courses: { title: string; slug: string } | { title: string; slug: string }[] | null }[]
                | null;
            }[] | null);
            const mod = relationOne(lesson?.modules ?? null);
            const course = relationOne(mod?.courses ?? null);
            if (!course || !lesson) return null;

            const slideIndex = b.bookmark_slide_index ?? 0;

            return (
              <PanelCard key={`${b.lesson_id}-${slideIndex}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <Bookmark className="mt-0.5 h-5 w-5 shrink-0 text-bao-light" />
                    <div>
                      <p className="font-semibold">{lesson.title}</p>
                      <p className="text-sm text-muted">{course.title}</p>
                      <p className="mt-1 text-xs text-secondary">
                        Bookmarked slide #{slideIndex + 1}
                      </p>
                    </div>
                  </div>
                  <Link href={`/learn/${course.slug}/${lesson.slug}`}>
                    <Button size="sm" variant="outline">
                      Open lesson
                    </Button>
                  </Link>
                </div>
              </PanelCard>
            );
          })
        ) : (
          <PanelCard>
            <p className="text-secondary">
              No bookmarks yet. While viewing a lesson, use the bookmark control on a slide to
              save it here.
            </p>
          </PanelCard>
        )}
      </div>
    </div>
  );
}
