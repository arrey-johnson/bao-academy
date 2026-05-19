"use client";

import { useState } from "react";
import { deleteAnnouncement } from "@/app/actions/admin";
import { AnnouncementForm } from "@/components/admin/AnnouncementForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { PanelCard } from "@/components/dashboard/PanelCard";

type Course = { id: string; title: string };
type Announcement = {
  id: string;
  title: string;
  body: string;
  course_id: string | null;
  published_at: string;
};

export function AnnouncementList({
  announcements,
  courses,
}: {
  announcements: Announcement[];
  courses: Course[];
}) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (!announcements.length) {
    return (
      <PanelCard>
        <p className="text-secondary">No announcements yet. Create one above.</p>
      </PanelCard>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((a) => (
        <PanelCard key={a.id}>
          {editingId === a.id ? (
            <AnnouncementForm
              courses={courses}
              announcement={a}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <p className="font-semibold text-[var(--foreground)]">{a.title}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingId(a.id)}
                    className="text-sm text-bao-light hover:underline"
                  >
                    Edit
                  </button>
                  <DeleteButton
                    label="Delete"
                    confirmMessage="Delete this announcement?"
                    onDelete={() => deleteAnnouncement(a.id)}
                  />
                </div>
              </div>
              <p className="mt-2 text-sm text-secondary leading-relaxed">{a.body}</p>
              <p className="mt-3 text-xs text-muted">
                {new Date(a.published_at).toLocaleDateString(undefined, {
                  dateStyle: "medium",
                })}
              </p>
            </>
          )}
        </PanelCard>
      ))}
    </div>
  );
}
