"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const allLinks = [
  {
    href: "/admin",
    label: "Overview",
    icon: LayoutDashboard,
    exact: true,
    superAdminOnly: true,
  },
  { href: "/admin/students", label: "Students", icon: Users, superAdminOnly: false },
  {
    href: "/admin/enrollments",
    label: "Enrollments",
    icon: GraduationCap,
    superAdminOnly: false,
  },
  { href: "/admin/courses", label: "Courses", icon: BookOpen, superAdminOnly: true },
  {
    href: "/admin/announcements",
    label: "Announcements",
    icon: Megaphone,
    superAdminOnly: true,
  },
  {
    href: "/admin/submissions",
    label: "Submissions",
    icon: ClipboardList,
    superAdminOnly: true,
  },
] as const;

export function AdminNav({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const pathname = usePathname();
  const links = allLinks.filter((l) => isSuperAdmin || !l.superAdminOnly);

  return (
    <nav className="flex flex-col gap-1">
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
