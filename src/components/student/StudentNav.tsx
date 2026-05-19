"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Bookmark,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  Send,
  TrendingUp,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/courses", label: "My courses", icon: GraduationCap },
  { href: "/dashboard/progress", label: "Progress", icon: TrendingUp },
  { href: "/dashboard/assignments", label: "Assignments", icon: ClipboardList },
  { href: "/dashboard/submissions", label: "Submissions", icon: Send },
  { href: "/dashboard/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/dashboard/announcements", label: "Announcements", icon: Megaphone },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export function StudentNav({ learnHref }: { learnHref: string }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      <Link
        href={learnHref}
        className={cn(
          "admin-nav-link",
          pathname.startsWith("/learn") && "admin-nav-link-active"
        )}
      >
        <BookOpen className="h-4 w-4 shrink-0" />
        Learn
      </Link>
      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn("admin-nav-link", active && "admin-nav-link-active")}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
