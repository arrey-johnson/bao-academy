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
import { getHomePathForRole } from "@/lib/auth/roles";
import { resolveRole } from "@/lib/auth/resolve-role";
import { Button } from "@/components/ui/button";

function EmailField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="email"
        className="block text-sm font-medium"
        style={{ color: "var(--auth-label)" }}
      >
        Email
      </label>
      <div className="relative">
        <Mail className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[var(--auth-muted)]" />
        <input
          id="email"
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
          className="auth-input"
        />
      </div>
    </div>
  );
}

function PasswordField({
  value,
  onChange,
  showPassword,
  onToggle,
}: {
  value: string;
  onChange: (v: string) => void;
  showPassword: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="password"
        className="block text-sm font-medium"
        style={{ color: "var(--auth-label)" }}
      >
        Password
      </label>
      <div className="relative">
        <Lock className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[var(--auth-muted)]" />
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Your password"
          required
          autoComplete="current-password"
          className="auth-input pr-12"
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggle();
          }}
          onMouseDown={(e) => e.preventDefault()}
          className="absolute right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--auth-muted)] transition-colors hover:bg-zinc-700/50 hover:text-[var(--foreground)] light:hover:bg-zinc-100"
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
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
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      const { data: profile } = signInData.user
        ? await supabase
            .from("profiles")
            .select("role")
            .eq("id", signInData.user.id)
            .maybeSingle()
        : { data: null };

      const role = resolveRole(signInData.user, profile?.role);
      const roleHome = getHomePathForRole(role);

      const destination =
        !redirectParam || redirectParam === "/dashboard"
          ? roleHome
          : roleHome === "/admin" && !redirectParam.startsWith("/admin")
            ? roleHome
            : redirectParam;

      router.push(destination);
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
            Sign in
          </h2>
          <p className="mt-1.5 text-sm" style={{ color: "var(--auth-muted)" }}>
            Students and staff — use your enrolled credentials.
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
            New students are enrolled by BAO staff.{" "}
            <span style={{ color: "var(--auth-muted)" }}>
              Need access?{" "}
              <a
                href="mailto:contact@baotechnologies.com"
                className="font-medium text-bao-light hover:underline"
              >
                contact@baotechnologies.com
              </a>
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <EmailField value={email} onChange={setEmail} />
          <PasswordField
            value={password}
            onChange={setPassword}
            showPassword={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
          />

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
