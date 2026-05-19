import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { Logo } from "@/components/brand/Logo";

export default function SignupPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <Logo height={48} href={false} className="mb-8" />
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">Join BAO Academy</h1>
        <p className="mt-2 text-zinc-500">Learn by Building, Not by Watching</p>
      </div>
      <Suspense fallback={<p className="text-sm text-zinc-400">Loading…</p>}>
        <AuthForm mode="signup" />
      </Suspense>
    </div>
  );
}
