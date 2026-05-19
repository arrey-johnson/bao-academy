export const ADMIN_ROLES = ["admin", "instructor"] as const;

export type UserRole = "student" | "mentor" | "admin" | "instructor" | string;

export function isAdminRole(role: string | null | undefined): boolean {
  return role === "admin" || role === "instructor";
}

export function getHomePathForRole(role: string | null | undefined): string {
  return isAdminRole(role) ? "/admin" : "/dashboard";
}
