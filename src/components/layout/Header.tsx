import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { resolveRole } from "@/lib/auth/resolve-role";
import { getLearnCourseSlug } from "@/lib/student/queries";
import { Navbar } from "@/components/layout/Navbar";

export async function Header() {
  if (!isSupabaseConfigured()) {
    return <Navbar user={null} fullName={null} streak={0} role={null} />;
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let streak = 0;
    let fullName: string | null = null;
    let role: string | null = null;

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("current_streak, full_name, role")
        .eq("id", user.id)
        .single();
      streak = profile?.current_streak ?? 0;
      fullName = profile?.full_name ?? null;
      role = resolveRole(user, profile?.role);
    }

    const learnHref = user
      ? `/learn/${await getLearnCourseSlug(user.id)}`
      : "/learn/html-css-js";

    return (
      <Navbar
        user={user ? { id: user.id, email: user.email } : null}
        fullName={fullName}
        streak={streak}
        role={role}
        learnHref={learnHref}
      />
    );
  } catch {
    return <Navbar user={null} fullName={null} streak={0} role={null} />;
  }
}
