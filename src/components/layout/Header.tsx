import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { Navbar } from "@/components/layout/Navbar";

export async function Header() {
  if (!isSupabaseConfigured()) {
    return <Navbar user={null} fullName={null} streak={0} />;
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let streak = 0;
    let fullName: string | null = null;

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("current_streak, full_name")
        .eq("id", user.id)
        .single();
      streak = profile?.current_streak ?? 0;
      fullName = profile?.full_name ?? null;
    }

    return (
      <Navbar
        user={user ? { id: user.id, email: user.email } : null}
        fullName={fullName}
        streak={streak}
      />
    );
  } catch {
    return <Navbar user={null} fullName={null} streak={0} />;
  }
}
