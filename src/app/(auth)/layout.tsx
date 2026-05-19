import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export default function AuthRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-zinc-950 light:bg-zinc-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(88,38,166,0.35),transparent)] light:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(88,38,166,0.12),transparent)]" />
      <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-10">
        <Logo height={36} />
        <Link
          href="/"
          className="text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100 light:text-zinc-600 light:hover:text-zinc-900"
        >
          ← Back to home
        </Link>
      </header>
      <main className="relative z-10 flex flex-1 flex-col px-4 pb-10 md:px-10">
        {children}
      </main>
    </div>
  );
}
