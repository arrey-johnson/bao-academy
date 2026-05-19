"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Flame,
  LayoutDashboard,
  LogOut,
  Menu,
  Shield,
  X,
} from "lucide-react";
import { isAdminRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavbarProps = {
  user: { id: string; email?: string } | null;
  fullName: string | null;
  streak: number;
  role?: string | null;
  learnHref?: string;
};

const publicLinks = [
  { href: "/#how-it-works", label: "How we train you" },
  { href: "/learn/html-css-js", label: "Courses" },
];

function getAuthLinks(learnHref: string) {
  return [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: learnHref, label: "Learn", icon: BookOpen },
  ];
}

function NavLink({
  href,
  label,
  icon: Icon,
  onClick,
}: {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isHash = href.includes("#");
  const active =
    !isHash &&
    (pathname === href ||
      (href !== "/" && pathname.startsWith(href)));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-bao/15 text-bao-light light:text-bao"
          : "text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-100 light:text-zinc-600 light:hover:bg-zinc-100 light:hover:text-zinc-900"
      )}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      {label}
    </Link>
  );
}

export function Navbar({
  user,
  fullName,
  streak,
  role,
  learnHref = "/learn/html-css-js",
}: NavbarProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const initials =
    fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "?";

  const studentLinks = getAuthLinks(learnHref);
  const links = user
    ? isAdminRole(role)
      ? [
          { href: "/admin", label: "Admin", icon: Shield },
          ...studentLinks,
        ]
      : studentLinks
    : publicLinks;

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-zinc-800/60 bg-black/70 backdrop-blur-xl backdrop-saturate-150 light:border-zinc-200/80 light:bg-white/85">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-bao/40 to-transparent light:via-bao/25" />

        <div className="relative mx-auto flex h-[4.25rem] max-w-6xl items-center gap-4 px-4 sm:px-6">
          <Logo height={34} className="shrink-0" />

          {/* Desktop nav */}
          <nav
            className="hidden flex-1 items-center justify-center gap-1 md:flex"
            aria-label="Main"
          >
            {links.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-2 md:flex">
            {user && streak > 0 && (
              <div
                className="flex items-center gap-1.5 rounded-full border border-bao/25 bg-bao/10 px-3 py-1.5 text-sm font-semibold text-bao-light"
                title="Learning streak"
              >
                <Flame className="h-4 w-4 text-bao" aria-hidden />
                <span>{streak}</span>
                <span className="sr-only">day streak</span>
              </div>
            )}

            <ThemeToggle />

            {user ? (
              <div className="ml-1 flex items-center gap-2 border-l border-zinc-800 pl-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-bao to-bao-hover text-xs font-bold text-white"
                  title={fullName ?? user.email}
                >
                  {initials}
                </div>
                <button
                  type="button"
                  onClick={signOut}
                  className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link href="/login">
                <Button size="sm">Student login</Button>
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="ml-auto flex items-center gap-2 md:hidden">
            {user && streak > 0 && (
              <div className="flex items-center gap-1 rounded-full bg-bao/10 px-2.5 py-1 text-xs font-semibold text-bao-light">
                <Flame className="h-3.5 w-3.5 text-bao" />
                {streak}
              </div>
            )}
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-x-0 top-[4.25rem] z-50 border-b border-zinc-800 bg-zinc-950/95 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl md:hidden">
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {links.map((link) => (
                <NavLink
                  key={link.href}
                  {...link}
                  onClick={() => setMobileOpen(false)}
                />
              ))}
            </nav>

            <div className="mt-4 border-t border-zinc-800 pt-4">
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 px-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-bao to-bao-hover text-sm font-bold text-white">
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-zinc-100">
                        {fullName ?? "Student"}
                      </p>
                      <p className="truncate text-xs text-zinc-500">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full justify-center gap-2"
                    onClick={signOut}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </Button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full">Student login</Button>
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
