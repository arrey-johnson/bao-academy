import { cn } from "@/lib/utils";

type DashboardShellProps = {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "5xl" | "6xl";
};

export function DashboardShell({
  children,
  className,
  maxWidth = "5xl",
}: DashboardShellProps) {
  return (
    <div className={cn("dashboard-page", className)}>
      <div
        className={cn(
          "relative mx-auto px-4 py-8 md:py-10",
          maxWidth === "6xl" ? "max-w-6xl" : "max-w-5xl"
        )}
      >
        {children}
      </div>
    </div>
  );
}
