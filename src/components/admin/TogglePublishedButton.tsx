"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleCoursePublished } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";

export function TogglePublishedButton({
  courseId,
  published,
}: {
  courseId: string;
  published: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    await toggleCoursePublished(courseId, !published);
    router.refresh();
    setLoading(false);
  }

  return (
    <Button
      type="button"
      variant={published ? "outline" : "primary"}
      size="sm"
      onClick={toggle}
      disabled={loading}
    >
      {loading ? "…" : published ? "Unpublish" : "Publish"}
    </Button>
  );
}
