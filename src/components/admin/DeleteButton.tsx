"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type DeleteButtonProps = {
  label?: string;
  confirmMessage: string;
  onDelete: () => Promise<{ ok: boolean; error?: string }>;
  redirectTo?: string;
};

export function DeleteButton({
  label = "Delete",
  confirmMessage,
  onDelete,
  redirectTo,
}: DeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (!window.confirm(confirmMessage)) return;
    setLoading(true);
    setError(null);
    const result = await onDelete();
    if (result.ok) {
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    } else {
      setError(result.error ?? "Delete failed");
    }
    setLoading(false);
  }

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5 border-red-500/40 text-red-400 hover:bg-red-500/10 light:text-red-600"
        onClick={handleClick}
        disabled={loading}
      >
        <Trash2 className="h-3.5 w-3.5" />
        {loading ? "Deleting…" : label}
      </Button>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
