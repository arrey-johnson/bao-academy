import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  href?: string;
  sublabel?: string;
  accent?: boolean;
};

export function StatCard({
  label,
  value,
  icon: Icon,
  href,
  sublabel,
  accent,
}: StatCardProps) {
  const inner = (
    <div
      className={cn(
        "surface-card flex h-full flex-col justify-between p-6 transition-all",
        href && "hover:border-[var(--bao-primary-light)] hover:shadow-lg hover:shadow-bao/10",
        accent && "surface-card-accent"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-secondary">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-[var(--foreground)]">
            {value}
          </p>
          {sublabel && (
            <p className="mt-1 text-xs text-muted">{sublabel}</p>
          )}
        </div>
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            accent ? "bg-bao/25 text-bao-light" : "bg-[var(--surface-muted)] text-bao-light"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{inner}</Link>;
  }
  return inner;
}
