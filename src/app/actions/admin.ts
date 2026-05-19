"use server";

import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/lib/admin/utils";
import { slugify } from "@/lib/admin/utils";
import { getAdminContext } from "@/lib/admin/assert";

function fail<T = void>(e: unknown): ActionResult<T> {
  return {
    ok: false,
    error: e instanceof Error ? e.message : "Something went wrong",
  };
}

function revalidateAdmin() {
  revalidatePath("/admin");
  revalidatePath("/admin/students");
  revalidatePath("/admin/courses");
  revalidatePath("/admin/enrollments");
  revalidatePath("/admin/announcements");
  revalidatePath("/admin/submissions");
  revalidatePath("/dashboard");
  revalidatePath("/learn", "layout");
}

// ——— Students ———

export async function enrollStudent(formData: FormData): Promise<ActionResult<{ userId: string }>> {
  try {
    const { service } = await getAdminContext();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    const fullName = String(formData.get("fullName") ?? "").trim();
    const courseId = String(formData.get("courseId") ?? "").trim() || null;

    if (!email || !password) return { ok: false, error: "Email and password are required." };
    if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };

    const { data: list } = await service.auth.admin.listUsers({ perPage: 1000 });
    const existing = list?.users?.find((u) => u.email?.toLowerCase() === email);

    let userId: string;
    if (existing) {
      userId = existing.id;
      const { error } = await service.auth.admin.updateUserById(userId, {
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName || email.split("@")[0], role: "student" },
      });
      if (error) return { ok: false, error: error.message };
    } else {
      const { data, error } = await service.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName || email.split("@")[0] },
      });
      if (error) return { ok: false, error: error.message };
      userId = data.user.id;
    }

    const { error: profileErr } = await service.from("profiles").upsert(
      {
        id: userId,
        email,
        full_name: fullName || email.split("@")[0],
        role: "student",
      },
      { onConflict: "id" }
    );
    if (profileErr) return { ok: false, error: profileErr.message };

    if (courseId) {
      await service.from("enrollments").upsert(
        { user_id: userId, course_id: courseId, progress_percent: 0 },
        { onConflict: "user_id,course_id" }
      );
    }

    revalidateAdmin();
    return { ok: true, data: { userId } };
  } catch (e) {
    return fail(e);
  }
}

export async function updateStudent(formData: FormData): Promise<ActionResult> {
  try {
    const { supabase, service } = await getAdminContext();
    const userId = String(formData.get("userId") ?? "");
    const fullName = String(formData.get("fullName") ?? "").trim();
    const role = String(formData.get("role") ?? "student");
    const email = String(formData.get("email") ?? "").trim().toLowerCase();

    if (!userId) return { ok: false, error: "User ID required." };
    if (!["student", "mentor", "admin", "instructor"].includes(role)) {
      return { ok: false, error: "Invalid role." };
    }

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, role, email, updated_at: new Date().toISOString() })
      .eq("id", userId);
    if (error) return { ok: false, error: error.message };

    await service.auth.admin.updateUserById(userId, {
      user_metadata: { full_name: fullName, role },
    });

    revalidateAdmin();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function resetStudentPassword(formData: FormData): Promise<ActionResult> {
  try {
    const { service } = await getAdminContext();
    const userId = String(formData.get("userId") ?? "");
    const password = String(formData.get("password") ?? "");
    if (!userId || password.length < 6) {
      return { ok: false, error: "User and password (min 6 chars) required." };
    }
    const { error } = await service.auth.admin.updateUserById(userId, { password });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteStudent(userId: string): Promise<ActionResult> {
  try {
    const { service } = await getAdminContext();
    if (!userId) return { ok: false, error: "User ID required." };
    const { error } = await service.auth.admin.deleteUser(userId);
    if (error) return { ok: false, error: error.message };
    revalidateAdmin();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

// ——— Enrollments ———

export async function assignEnrollment(formData: FormData): Promise<ActionResult> {
  try {
    const { supabase } = await getAdminContext();
    const userId = String(formData.get("userId") ?? "");
    const courseId = String(formData.get("courseId") ?? "");
    if (!userId || !courseId) return { ok: false, error: "Student and course required." };

    const { error } = await supabase.from("enrollments").upsert(
      { user_id: userId, course_id: courseId, progress_percent: 0 },
      { onConflict: "user_id,course_id" }
    );
    if (error) return { ok: false, error: error.message };
    revalidateAdmin();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function removeEnrollment(enrollmentId: string): Promise<ActionResult> {
  try {
    const { supabase } = await getAdminContext();
    const { error } = await supabase.from("enrollments").delete().eq("id", enrollmentId);
    if (error) return { ok: false, error: error.message };
    revalidateAdmin();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

// ——— Courses ———

export async function createCourse(formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    const { supabase } = await getAdminContext();
    const title = String(formData.get("title") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim() || slugify(title);
    const description = String(formData.get("description") ?? "").trim();
    const track = String(formData.get("track") ?? "html-css-js").trim();
    const published = formData.get("published") === "on";

    if (!title) return { ok: false, error: "Title is required." };

    const { data, error } = await supabase
      .from("courses")
      .insert({ title, slug, description, track, published, sort_order: 0 })
      .select("id")
      .single();
    if (error) return { ok: false, error: error.message };
    revalidateAdmin();
    return { ok: true, data: { id: data.id } };
  } catch (e) {
    return fail(e);
  }
}

export async function updateCourse(formData: FormData): Promise<ActionResult> {
  try {
    const { supabase } = await getAdminContext();
    const id = String(formData.get("id") ?? "");
    const title = String(formData.get("title") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const track = String(formData.get("track") ?? "").trim();
    const published = formData.get("published") === "on";
    const sortOrder = Number(formData.get("sortOrder") ?? 0);

    const { error } = await supabase
      .from("courses")
      .update({
        title,
        slug,
        description,
        track,
        published,
        sort_order: sortOrder,
      })
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidateAdmin();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteCourse(courseId: string): Promise<ActionResult> {
  try {
    const { supabase } = await getAdminContext();
    const { error } = await supabase.from("courses").delete().eq("id", courseId);
    if (error) return { ok: false, error: error.message };
    revalidateAdmin();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function toggleCoursePublished(courseId: string, published: boolean): Promise<ActionResult> {
  try {
    const { supabase } = await getAdminContext();
    const { error } = await supabase.from("courses").update({ published }).eq("id", courseId);
    if (error) return { ok: false, error: error.message };
    revalidateAdmin();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

// ——— Modules & lessons ———

export async function deleteModule(moduleId: string): Promise<ActionResult> {
  try {
    const { supabase } = await getAdminContext();
    const { error } = await supabase.from("modules").delete().eq("id", moduleId);
    if (error) return { ok: false, error: error.message };
    revalidateAdmin();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function createModule(formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    const { supabase } = await getAdminContext();
    const courseId = String(formData.get("courseId") ?? "");
    const title = String(formData.get("title") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim() || slugify(title);

    const { data, error } = await supabase
      .from("modules")
      .insert({ course_id: courseId, title, slug, sort_order: Number(formData.get("sortOrder") ?? 0) })
      .select("id")
      .single();
    if (error) return { ok: false, error: error.message };
    revalidateAdmin();
    return { ok: true, data: { id: data.id } };
  } catch (e) {
    return fail(e);
  }
}

export async function createLesson(formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    const { supabase } = await getAdminContext();
    const moduleId = String(formData.get("moduleId") ?? "");
    const title = String(formData.get("title") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim() || slugify(title);
    const description = String(formData.get("description") ?? "").trim();

    const { data, error } = await supabase
      .from("lessons")
      .insert({
        module_id: moduleId,
        title,
        slug,
        description,
        estimated_minutes: Number(formData.get("estimatedMinutes") ?? 10),
        sort_order: Number(formData.get("sortOrder") ?? 0),
      })
      .select("id")
      .single();
    if (error) return { ok: false, error: error.message };
    revalidateAdmin();
    return { ok: true, data: { id: data.id } };
  } catch (e) {
    return fail(e);
  }
}

export async function updateLesson(formData: FormData): Promise<ActionResult> {
  try {
    const { supabase } = await getAdminContext();
    const id = String(formData.get("id") ?? "");
    const { error } = await supabase
      .from("lessons")
      .update({
        title: String(formData.get("title") ?? "").trim(),
        slug: String(formData.get("slug") ?? "").trim(),
        description: String(formData.get("description") ?? "").trim(),
        estimated_minutes: Number(formData.get("estimatedMinutes") ?? 10),
        sort_order: Number(formData.get("sortOrder") ?? 0),
      })
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidateAdmin();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteLesson(lessonId: string): Promise<ActionResult> {
  try {
    const { supabase } = await getAdminContext();
    const { error } = await supabase.from("lessons").delete().eq("id", lessonId);
    if (error) return { ok: false, error: error.message };
    revalidateAdmin();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

// ——— Slides ———

export async function saveSlide(formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    const { supabase } = await getAdminContext();
    const id = String(formData.get("id") ?? "").trim();
    const lessonId = String(formData.get("lessonId") ?? "");
    const title = String(formData.get("title") ?? "").trim() || null;
    const slideType = String(formData.get("slideType") ?? "concept");
    const sortOrder = Number(formData.get("sortOrder") ?? 0);
    const contentRaw = String(formData.get("content") ?? '{"blocks":[]}');

    let content: object;
    try {
      content = JSON.parse(contentRaw);
    } catch {
      return { ok: false, error: "Slide content must be valid JSON." };
    }

    if (id) {
      const { error } = await supabase
        .from("slides")
        .update({ title, slide_type: slideType, sort_order: sortOrder, content })
        .eq("id", id);
      if (error) return { ok: false, error: error.message };
      revalidateAdmin();
      return { ok: true, data: { id } };
    }

    const { data, error } = await supabase
      .from("slides")
      .insert({ lesson_id: lessonId, title, slide_type: slideType, sort_order: sortOrder, content })
      .select("id")
      .single();
    if (error) return { ok: false, error: error.message };
    revalidateAdmin();
    return { ok: true, data: { id: data.id } };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteSlide(slideId: string): Promise<ActionResult> {
  try {
    const { supabase } = await getAdminContext();
    const { error } = await supabase.from("slides").delete().eq("id", slideId);
    if (error) return { ok: false, error: error.message };
    revalidateAdmin();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

// ——— Announcements ———

export async function saveAnnouncement(formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    const { supabase } = await getAdminContext();
    const id = String(formData.get("id") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();
    const body = String(formData.get("body") ?? "").trim();
    const courseId = String(formData.get("courseId") ?? "").trim() || null;

    if (!title || !body) return { ok: false, error: "Title and body required." };

    if (id) {
      const { error } = await supabase
        .from("announcements")
        .update({ title, body, course_id: courseId })
        .eq("id", id);
      if (error) return { ok: false, error: error.message };
      revalidateAdmin();
      return { ok: true, data: { id } };
    }

    const { data, error } = await supabase
      .from("announcements")
      .insert({ title, body, course_id: courseId })
      .select("id")
      .single();
    if (error) return { ok: false, error: error.message };
    revalidateAdmin();
    return { ok: true, data: { id: data.id } };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteAnnouncement(id: string): Promise<ActionResult> {
  try {
    const { supabase } = await getAdminContext();
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidateAdmin();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

// ——— Submissions ———

export async function updateSubmissionStatus(
  submissionId: string,
  status: string
): Promise<ActionResult> {
  try {
    const { supabase } = await getAdminContext();
    const allowed = ["draft", "submitted", "in_review", "needs_revision", "approved"];
    if (!allowed.includes(status)) return { ok: false, error: "Invalid status." };

    const { error } = await supabase
      .from("submissions")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", submissionId);
    if (error) return { ok: false, error: error.message };
    revalidateAdmin();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function reviewSubmission(formData: FormData): Promise<ActionResult> {
  try {
    const { supabase, user } = await getAdminContext();
    const submissionId = String(formData.get("submissionId") ?? "");
    const comments = String(formData.get("comments") ?? "").trim();
    const approved = formData.get("approved") === "on";
    const status = approved ? "approved" : "needs_revision";

    const { error: subErr } = await supabase
      .from("submissions")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", submissionId);
    if (subErr) return { ok: false, error: subErr.message };

    const { error: revErr } = await supabase.from("reviews").insert({
      submission_id: submissionId,
      mentor_id: user.id,
      comments,
      approved,
    });
    if (revErr) return { ok: false, error: revErr.message };

    revalidateAdmin();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}
