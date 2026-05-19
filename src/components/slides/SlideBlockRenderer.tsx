"use client";

import type { SlideBlock } from "@/types/slides";

export function SlideBlockRenderer({ block }: { block: SlideBlock }) {
  switch (block.type) {
    case "heading":
      return (
        <h2 className="text-2xl font-bold tracking-tight text-zinc-50">
          {block.text}
        </h2>
      );
    case "text":
      return (
        <p className="text-base leading-relaxed text-bao-muted">
          {block.text}
        </p>
      );
    case "code":
      return (
        <pre className="overflow-x-auto rounded-xl bg-zinc-950 p-4 text-sm text-purple-200">
          <code>{block.snippet}</code>
        </pre>
      );
    case "challenge":
      return (
        <div className="rounded-xl border border-bao/30 bg-bao/10 p-4">
          <p className="font-medium text-purple-200">
            {block.prompt}
          </p>
          {block.hint && (
            <p className="mt-2 text-sm text-bao-muted">
              Hint: {block.hint}
            </p>
          )}
        </div>
      );
    default:
      return null;
  }
}
