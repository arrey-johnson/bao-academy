"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  AlertCircle,
  Info,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function AuthField({
  id,
  label,
  icon: Icon,
  children,
}: {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium"
        style={{ color: "var(--auth-label)" }}
      >
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--auth-muted)]" />
        {children}
      </div>
    </div>
  );
}

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/dashboard";
  const authError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authError === "auth") {
      setError("Sign-in link expired or was invalid. Please try again.");
    }
  }, [authError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(signInError.message);
        return;
      }
      router.push(redirect);
      router.refresh();
    } catch {
      setError("Something went wrong. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="auth-card p-8">
        <div className="mb-8">
          <h2
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Student sign in
          </h2>
          <p className="mt-1.5 text-sm" style={{ color: "var(--auth-muted)" }}>
            Use the email and password provided when you were enrolled.
          </p>
        </div>

        <div
          className="mb-6 flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm"
          style={{
            backgroundColor: "var(--auth-info-bg)",
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "var(--auth-info-border)",
            color: "var(--auth-info-text)",
          }}
        >
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-bao-light" />
          <p>
            Accounts are created by BAO Academy staff only.{" "}
            <span style={{ color: "var(--auth-muted)" }}>
              Need access? Contact{" "}
              <a
                href="mailto:contact@baotechnologies.com"
                className="font-medium text-bao-light hover:underline"
              >
                contact@baotechnologies.com
              </a>
              .
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthField id="email" label="Email" icon={Mail}>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="auth-input"
            />
          </AuthField>

          <AuthField id="password" label="Password" icon={Lock}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
              autoComplete="current-password"
              className={cn("auth-input", "pr-12")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[var(--auth-muted)] transition-colors hover:opacity-80"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </AuthField>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-xl border border-red-500/40 bg-red-500/15 px-4 py-3 text-sm text-red-200 light:border-red-200 light:bg-red-50 light:text-red-700"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            className="mt-2 h-12 w-full text-base font-semibold shadow-lg shadow-bao/25"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Please wait…
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
