export const SUPER_ADMIN_ROLES = ["admin", "instructor"] as const;
export const COURSE_ADMIN_ROLE = "course_admin" as const;

export const ADMIN_PANEL_ROLES = [
  ...SUPER_ADMIN_ROLES,
  COURSE_ADMIN_ROLE,
] as const;

export type SuperAdminRole = (typeof SUPER_ADMIN_ROLES)[number];
export type AdminPanelRole = (typeof ADMIN_PANEL_ROLES)[number];
export type UserRole =
  | "student"
  | "mentor"
  | AdminPanelRole
  | string;

/** Full platform admin (curriculum, announcements, submissions, role upgrades). */
export function isSuperAdminRole(role: string | null | undefined): boolean {
  return role === "admin" || role === "instructor";
}

/** Can access /admin for students and enrollments only. */
export function isCourseAdminRole(role: string | null | undefined): boolean {
  return role === COURSE_ADMIN_ROLE;
}

/** Any admin-area access (super admin or course admin). */
export function isAdminPanelRole(role: string | null | undefined): boolean {
  return isSuperAdminRole(role) || isCourseAdminRole(role);
}

/** @deprecated Use isAdminPanelRole — kept for call sites that mean “admin area”. */
export function isAdminRole(role: string | null | undefined): boolean {
  return isAdminPanelRole(role);
}

export function getHomePathForRole(role: string | null | undefined): string {
  if (isCourseAdminRole(role)) return "/admin/students";
  return isSuperAdminRole(role) ? "/admin" : "/dashboard";
}

export const ROLE_LABELS: Record<string, string> = {
  student: "Student",
  mentor: "Mentor",
  instructor: "Instructor",
  admin: "Super admin",
  course_admin: "Course admin",
};

export const SUPER_ADMIN_ASSIGNABLE_ROLES = [
  "student",
  "mentor",
  "instructor",
  "admin",
  COURSE_ADMIN_ROLE,
] as const;

export const COURSE_ADMIN_ASSIGNABLE_ROLES = ["student", "mentor"] as const;

export const PROTECTED_ACCOUNT_ROLES = [
  "admin",
  "instructor",
  COURSE_ADMIN_ROLE,
] as const;
