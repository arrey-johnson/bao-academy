"use client";

import type { SlideBlock } from "@/types/slides";

export function SlideBlockRenderer({ block }: { block: SlideBlock }) {
  switch (block.type) {
    case "heading":
      return (
        <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
          {block.text}
        </h2>
      );
    case "text":
      return (
        <p className="text-base leading-relaxed text-secondary">
          {block.text}
        </p>
      );
    case "code":
      return (
        <pre className="overflow-x-auto rounded-xl border border-[var(--surface-border)] bg-[var(--surface-inset)] p-4 text-sm text-bao dark:text-purple-200">
          <code>{block.snippet}</code>
        </pre>
      );
    case "challenge":
      return (
        <div className="rounded-xl border border-[var(--accent-border)] bg-[var(--accent-subtle)] p-4">
          <p className="font-medium text-bao dark:text-purple-200">
            {block.prompt}
          </p>
          {block.hint && (
            <p className="mt-2 text-sm text-secondary">
              Hint: {block.hint}
            </p>
          )}
        </div>
      );
    default:
      return null;
  }
}
