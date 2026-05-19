import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function AuthRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative flex min-h-screen flex-col overflow-hidden"
      style={{ backgroundColor: "var(--auth-page-bg)", color: "var(--foreground)" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(88,38,166,0.35),transparent)] light:opacity-50" />
      <header className="relative z-10 flex items-center justify-between gap-4 px-6 py-5 md:px-10">
        <Logo height={36} />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/"
            className="text-sm font-medium transition-colors"
            style={{ color: "var(--auth-muted)" }}
          >
            ← Back to home
          </Link>
        </div>
      </header>
      <main className="relative z-10 flex flex-1 flex-col px-4 pb-10 md:px-10">
        {children}
      </main>
    </div>
  );
}
