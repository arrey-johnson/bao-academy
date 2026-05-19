import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BookOpen, Flame, Megaphone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .eq("published", true)
    .order("sort_order");

  const primaryCourse = courses?.[0];
  let enrollment = null;
  let lastLesson: { slug: string; title: string } | null = null;

  if (primaryCourse) {
    const { data } = await supabase
      .from("enrollments")
      .select("*")
      .eq("user_id", user.id)
      .eq("course_id", primaryCourse.id)
      .maybeSingle();
    enrollment = data;

    if (!enrollment) {
      await supabase.from("enrollments").insert({
        user_id: user.id,
        course_id: primaryCourse.id,
        progress_percent: 0,
      });
      enrollment = {
        progress_percent: 0,
        last_lesson_id: null,
      } as typeof enrollment;
    }

    if (enrollment?.last_lesson_id) {
      const { data: lesson } = await supabase
        .from("lessons")
        .select("slug, title")
        .eq("id", enrollment.last_lesson_id)
        .single();
      lastLesson = lesson;
    }
  }

  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(3);

  const continueSlug = lastLesson?.slug ?? "css-flexbox";
  const progress = Number(enrollment?.progress_percent ?? 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          Hey, {profile?.full_name ?? "builder"} 👋
        </h1>
        <p className="mt-2 text-zinc-500">Ready to ship something today?</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 border-bao/20 bg-gradient-to-br from-bao/5 to-transparent">
          <p className="text-sm font-medium text-bao-light">
            Continue learning
          </p>
          <h2 className="mt-2 text-xl font-semibold">
            {lastLesson?.title ?? "CSS Flexbox"}
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            {primaryCourse?.title ?? "HTML, CSS & JavaScript"}
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-bao transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-zinc-400">{progress}% complete</p>
          <Link
            href={`/learn/${primaryCourse?.slug ?? "html-css-js"}/${continueSlug}`}
            className="mt-6 inline-block"
          >
            <Button className="gap-2">
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Card>

        <Card className="flex flex-col items-center justify-center text-center">
          <Flame className="h-10 w-10 text-bao" />
          <p className="mt-3 text-3xl font-bold">{profile?.current_streak ?? 0}</p>
          <p className="text-sm text-zinc-500">day streak</p>
        </Card>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Card>
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-500">
            <BookOpen className="h-4 w-4" />
            Active course
          </div>
          <h3 className="mt-3 font-semibold">{primaryCourse?.title}</h3>
          <p className="mt-2 text-sm text-zinc-500 line-clamp-2">
            {primaryCourse?.description}
          </p>
          <Link href={`/learn/${primaryCourse?.slug}`} className="mt-4 inline-block">
            <Button variant="outline" size="sm">
              View curriculum
            </Button>
          </Link>
        </Card>

        <Card>
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-500">
            <Megaphone className="h-4 w-4" />
            Announcements
          </div>
          <ul className="mt-3 space-y-3">
            {announcements?.length ? (
              announcements.map((a) => (
                <li key={a.id}>
                  <p className="font-medium text-sm">{a.title}</p>
                  <p className="text-xs text-zinc-500 line-clamp-2">{a.body}</p>
                </li>
              ))
            ) : (
              <li className="text-sm text-zinc-400">No announcements yet.</li>
            )}
          </ul>
        </Card>
      </div>
    </div>
  );
}
