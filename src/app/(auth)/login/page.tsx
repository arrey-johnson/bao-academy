import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function LoginPage() {
  return (
    <AuthLayout>
      <Suspense
        fallback={
          <div className="flex h-64 w-full max-w-md items-center justify-center rounded-3xl border border-white/10 bg-zinc-900/60 light:border-zinc-200 light:bg-white">
            <p className="text-sm text-zinc-400">Loading…</p>
          </div>
        }
      >
        <AuthForm />
      </Suspense>
    </AuthLayout>
  );
}
