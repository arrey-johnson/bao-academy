import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublicEnv } from "@/lib/supabase/env";
import { getHomePathForRole } from "@/lib/auth/roles";
import { resolveRole } from "@/lib/auth/resolve-role";

export async function updateSession(request: NextRequest) {
  const env = getSupabasePublicEnv();

  if (!env) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  try {
    const { createServerClient } = await import("@supabase/ssr");

    const supabase = createServerClient(env.url, env.anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const path = request.nextUrl.pathname;
    if (path === "/signup") {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    const isAuthPage = path === "/login";
    const isProtected =
      path.startsWith("/dashboard") ||
      path.startsWith("/admin") ||
      path.startsWith("/learn") ||
      path.startsWith("/assignments");

    if (!user && isProtected) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", path);
      return NextResponse.redirect(url);
    }

    if (user && isAuthPage) {
      const url = request.nextUrl.clone();
      url.pathname = getHomePathForRole(resolveRole(user));
      return NextResponse.redirect(url);
    }
  } catch (error) {
    console.error("[proxy] Supabase session update failed:", error);
    return NextResponse.next({ request });
  }

  return supabaseResponse;
}
