import { createClient } from "@/lib/supabase/server";
import { relationOne } from "@/lib/student/utils";

export async function getStudentEnrollments(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("enrollments")
    .select(
      "id, progress_percent, last_lesson_id, enrolled_at, courses(id, title, slug, description, published)"
    )
    .eq("user_id", userId)
    .order("enrolled_at", { ascending: false });
  return data ?? [];
}

export async function getPrimaryEnrollment(userId: string) {
  const enrollments = await getStudentEnrollments(userId);
  const active = enrollments.filter((e) => {
    const course = relationOne(
      e.courses as { published?: boolean } | { published?: boolean }[] | null
    );
    return course?.published !== false;
  });
  return active[0] ?? null;
}

export async function getLearnCourseSlug(userId: string): Promise<string> {
  const primary = await getPrimaryEnrollment(userId);
  const course = relationOne(primary?.courses as { slug: string } | { slug: string }[] | null);
  if (course?.slug) return course.slug;

  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select("slug")
    .eq("published", true)
    .order("sort_order")
    .limit(1)
    .maybeSingle();
  return data?.slug ?? "html-css-js";
}

export async function getContinueLesson(
  userId: string,
  lastLessonId: string | null
): Promise<{ slug: string; title: string } | null> {
  if (!lastLessonId) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("lessons")
    .select("slug, title")
    .eq("id", lastLessonId)
    .maybeSingle();
  return data;
}

export async function getFirstLessonSlug(courseId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data: modules } = await supabase
    .from("modules")
    .select("id")
    .eq("course_id", courseId)
    .order("sort_order")
    .limit(1);

  const moduleId = modules?.[0]?.id;
  if (!moduleId) return null;

  const { data: lesson } = await supabase
    .from("lessons")
    .select("slug")
    .eq("module_id", moduleId)
    .order("sort_order")
    .limit(1)
    .maybeSingle();

  return lesson?.slug ?? null;
}

export async function getStudentAnnouncements(userId: string, limit?: number) {
  const supabase = await createClient();
  const enrollments = await getStudentEnrollments(userId);
  const courseIds = enrollments
    .map((e) => relationOne(e.courses as { id: string } | { id: string }[] | null)?.id)
    .filter(Boolean) as string[];

  let query = supabase.from("announcements").select("*").order("published_at", {
    ascending: false,
  });

  if (courseIds.length) {
    query = query.or(`course_id.is.null,course_id.in.(${courseIds.join(",")})`);
  } else {
    query = query.is("course_id", null);
  }

  if (limit) query = query.limit(limit);
  const { data } = await query;
  return data ?? [];
}

export async function getPublishedCourses() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select("id, title, slug, description, track")
    .eq("published", true)
    .order("sort_order");
  return data ?? [];
}

export async function getLessonProgressMap(userId: string, lessonIds: string[]) {
  if (!lessonIds.length) return new Map<string, { is_completed: boolean; current_slide_index: number }>();
  const supabase = await createClient();
  const { data } = await supabase
    .from("lesson_progress")
    .select("lesson_id, is_completed, current_slide_index")
    .eq("user_id", userId)
    .in("lesson_id", lessonIds);

  return new Map(
    (data ?? []).map((p) => [
      p.lesson_id,
      { is_completed: p.is_completed, current_slide_index: p.current_slide_index },
    ])
  );
}

export async function getCourseProgressDetail(userId: string, courseId: string) {
  const supabase = await createClient();
  const { data: modules } = await supabase
    .from("modules")
    .select(
      "id, title, slug, sort_order, lessons(id, title, slug, estimated_minutes, sort_order)"
    )
    .eq("course_id", courseId)
    .order("sort_order");

  const lessonIds =
    modules?.flatMap((m) =>
      ((m.lessons as { id: string }[]) ?? []).map((l) => l.id)
    ) ?? [];

  const progressMap = await getLessonProgressMap(userId, lessonIds);

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("progress_percent")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .maybeSingle();

  return {
    modules: modules ?? [],
    progressMap,
    progressPercent: Number(enrollment?.progress_percent ?? 0),
  };
}

export async function getStudentAssignments(userId: string) {
  const supabase = await createClient();
  const enrollments = await getStudentEnrollments(userId);
  const courseIds = enrollments
    .map((e) => relationOne(e.courses as { id: string } | { id: string }[] | null)?.id)
    .filter(Boolean) as string[];

  if (!courseIds.length) return [];

  const { data: assignments } = await supabase
    .from("assignments")
    .select(
      "id, title, description, due_at, course_id, lesson_id, courses(title, slug), lessons(title, slug)"
    )
    .in("course_id", courseIds)
    .order("created_at", { ascending: false });

  if (!assignments?.length) return [];

  const assignmentIds = assignments.map((a) => a.id);
  const { data: submissions } = await supabase
    .from("submissions")
    .select("id, assignment_id, status, github_url, deploy_url, submitted_at, updated_at")
    .eq("user_id", userId)
    .in("assignment_id", assignmentIds);

  const subByAssignment = new Map(
    (submissions ?? []).map((s) => [s.assignment_id, s])
  );

  return assignments.map((a) => ({
    ...a,
    submission: subByAssignment.get(a.id) ?? null,
  }));
}

export async function getStudentSubmissions(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("submissions")
    .select(
      "id, status, github_url, deploy_url, submitted_at, updated_at, assignments(id, title, description, courses(title, slug)), reviews(id, comments, approved, created_at)"
    )
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  return data ?? [];
}

export async function getStudentBookmarks(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("lesson_progress")
    .select(
      "lesson_id, bookmark_slide_index, current_slide_index, lessons(id, title, slug, modules(id, courses(id, title, slug)))"
    )
    .eq("user_id", userId)
    .not("bookmark_slide_index", "is", null);

  return data ?? [];
}

export async function getAssignmentWithSubmission(userId: string, assignmentId: string) {
  const supabase = await createClient();
  const { data: assignment } = await supabase
    .from("assignments")
    .select("*, courses(id, title, slug), lessons(id, title, slug)")
    .eq("id", assignmentId)
    .maybeSingle();

  if (!assignment) return null;

  const { data: submission } = await supabase
    .from("submissions")
    .select("*")
    .eq("user_id", userId)
    .eq("assignment_id", assignmentId)
    .maybeSingle();

  const { data: reviews } = submission
    ? await supabase
        .from("reviews")
        .select("id, comments, approved, created_at")
        .eq("submission_id", submission.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  return { assignment, submission, reviews: reviews ?? [] };
}
