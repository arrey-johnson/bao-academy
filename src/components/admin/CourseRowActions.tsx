"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { deleteCourse } from "@/app/actions/admin";
import { TogglePublishedButton } from "@/components/admin/TogglePublishedButton";
import { Button } from "@/components/ui/button";

type CourseRowActionsProps = {
  courseId: string;
  slug: string;
  published: boolean;
  title: string;
};

export function CourseRowActions({ courseId, slug, published, title }: CourseRowActionsProps) {
  const router = useRouter();

  async function handleDelete() {
    if (
      !window.confirm(
        `Delete "${title}"?\n\nThis removes all modules, lessons, slides, and related enrollments. This cannot be undone.`
      )
    ) {
      return;
    }
    const result = await deleteCourse(courseId);
    if (result.ok) {
      router.refresh();
    } else {
      alert(result.error ?? "Could not delete course.");
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Link href={`/admin/courses/${courseId}`}>
        <Button type="button" size="sm" variant="outline" className="gap-1.5">
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
      </Link>
      <TogglePublishedButton courseId={courseId} published={published} />
      <Link href={`/learn/${slug}`} target="_blank" rel="noopener noreferrer">
        <Button type="button" size="sm" variant="ghost">
          Preview
        </Button>
      </Link>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="gap-1.5 border-red-500/40 text-red-400 hover:bg-red-500/10 light:text-red-600"
        onClick={handleDelete}
      >
        <Trash2 className="h-3.5 w-3.5" />
        Delete
      </Button>
    </div>
  );
}
