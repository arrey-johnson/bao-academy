"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { enrollInCourse } from "@/app/actions/progress";
import { Button } from "@/components/ui/button";

export function StartCourseButton({
  courseId,
  courseSlug,
  enrolled,
}: {
  courseId: string;
  courseSlug: string;
  enrolled: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (enrolled) {
    return (
      <a href={`/learn/${courseSlug}`}>
        <Button variant="outline" size="sm" type="button">
          Continue
        </Button>
      </a>
    );
  }

  async function start() {
    setLoading(true);
    await enrollInCourse(courseId);
    router.push(`/learn/${courseSlug}`);
    router.refresh();
  }

  return (
    <Button size="sm" onClick={start} disabled={loading}>
      {loading ? "Starting…" : "Start course"}
    </Button>
  );
}
