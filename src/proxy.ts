import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/session";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Only run auth proxy on routes that need it (keeps / and static assets fast).
  matcher: [
    "/dashboard/:path*",
    "/learn/:path*",
    "/assignments/:path*",
    "/login",
    "/signup",
    "/auth/callback",
  ],
};
