import { redirect } from "next/navigation";

/** Public registration is disabled — admins enroll students in Supabase. */
export default function SignupPage() {
  redirect("/login");
}
