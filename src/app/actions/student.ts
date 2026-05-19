"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/admin/utils";

function fail<T = void>(e: unknown): ActionResult<T> {
  return {
    ok: false,
    error: e instanceof Error ? e.message : "Something went wrong",
  };
}

function revalidateStudent() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/assignments", "layout");
  revalidatePath("/dashboard/submissions");
  revalidatePath("/dashboard/profile");
  revalidatePath("/admin/submissions");
}

export async function updateStudentProfile(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "Not signed in." };

    const fullName = String(formData.get("fullName") ?? "").trim();
    if (!fullName) return { ok: false, error: "Name is required." };

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, updated_at: new Date().toISOString() })
      .eq("id", user.id);
    if (error) return { ok: false, error: error.message };

    await supabase.auth.updateUser({
      data: { full_name: fullName },
    });

    revalidateStudent();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function saveSubmission(formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "Not signed in." };

    const assignmentId = String(formData.get("assignmentId") ?? "");
    const githubUrl = String(formData.get("githubUrl") ?? "").trim() || null;
    const deployUrl = String(formData.get("deployUrl") ?? "").trim() || null;
    const submit = formData.get("submit") === "true";

    if (!assignmentId) return { ok: false, error: "Assignment required." };
    if (submit && !githubUrl) {
      return { ok: false, error: "GitHub URL is required to submit." };
    }

    const { data: existing } = await supabase
      .from("submissions")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("assignment_id", assignmentId)
      .maybeSingle();

    if (existing && existing.status === "approved") {
      return { ok: false, error: "This submission is already approved." };
    }

    const payload = {
      assignment_id: assignmentId,
      user_id: user.id,
      github_url: githubUrl,
      deploy_url: deployUrl,
      status: submit ? "submitted" : "draft",
      submitted_at: submit ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    if (existing) {
      const { error } = await supabase
        .from("submissions")
        .update(payload)
        .eq("id", existing.id);
      if (error) return { ok: false, error: error.message };
      revalidateStudent();
      return { ok: true, data: { id: existing.id } };
    }

    const { data, error } = await supabase
      .from("submissions")
      .insert(payload)
      .select("id")
      .single();
    if (error) return { ok: false, error: error.message };

    revalidateStudent();
    return { ok: true, data: { id: data.id } };
  } catch (e) {
    return fail(e);
  }
}
