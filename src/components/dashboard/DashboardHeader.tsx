type DashboardHeaderProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  action?: React.ReactNode;
};

export function DashboardHeader({
  title,
  description,
  eyebrow,
  action,
}: DashboardHeaderProps) {
  return (
    <header className="mb-8 md:mb-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          {eyebrow && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-bao-light">
              {eyebrow}
            </p>
          )}
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-2xl text-base text-secondary">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  );
}
