const styles: Record<string, string> = {
  draft: "badge",
  submitted: "badge badge-accent",
  in_review: "badge",
  needs_revision: "badge",
  approved: "badge badge-accent",
};

const labels: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  in_review: "In review",
  needs_revision: "Needs revision",
  approved: "Approved",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`${styles[status] ?? "badge"} capitalize`}>
      {labels[status] ?? status.replace("_", " ")}
    </span>
  );
}
