"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin]", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <p className="text-lg font-semibold text-[var(--foreground)]">This page couldn&apos;t load</p>
      <p className="mt-2 text-sm text-secondary">
        A server error occurred in the admin area. If this persists, confirm{" "}
        <code className="text-xs">SUPABASE_SERVICE_ROLE_KEY</code> is set on production.
      </p>
      <Button className="mt-6" onClick={() => reset()}>
        Reload
      </Button>
    </div>
  );
}
