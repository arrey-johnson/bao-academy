import { cn } from "@/lib/utils";

type PanelCardProps = {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  accent?: boolean;
  noPadding?: boolean;
};

export function PanelCard({
  children,
  className,
  title,
  description,
  icon,
  accent,
  noPadding,
}: PanelCardProps) {
  return (
    <section
      className={cn(
        "surface-card",
        accent && "surface-card-accent",
        !noPadding && "p-6",
        className
      )}
    >
      {(title || description) && (
        <header className={cn("mb-5", noPadding && "border-b border-[var(--surface-border)] px-6 py-4")}>
          <div className="flex items-center gap-2">
            {icon}
            {title && (
              <h2 className="font-semibold text-[var(--foreground)]">{title}</h2>
            )}
          </div>
          {description && (
            <p className={cn("text-sm text-secondary", title && "mt-1")}>
              {description}
            </p>
          )}
        </header>
      )}
      {children}
    </section>
  );
}
