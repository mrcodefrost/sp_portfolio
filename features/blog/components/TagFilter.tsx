"use client";

import { useState } from "react";
import Link from "next/link";

const VISIBLE_COUNT = 8;

const pill =
  "text-sm font-medium px-3.5 py-1.5 rounded-full border transition-colors";
const pillActive = "bg-purple-600 text-white border-purple-600";
const pillInactive =
  "border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:border-purple-400 hover:text-purple-600 dark:hover:border-purple-600 dark:hover:text-purple-400";

interface TagFilterProps {
  allTags: string[];
  activeTag?: string;
}

export default function TagFilter({ allTags, activeTag }: TagFilterProps) {
  // If the active tag sits beyond the fold, start expanded so it's visible.
  const activeIndex = activeTag ? allTags.indexOf(activeTag) : -1;
  const [expanded, setExpanded] = useState(activeIndex >= VISIBLE_COUNT);

  if (allTags.length === 0) return null;

  const needsTruncation = allTags.length > VISIBLE_COUNT;
  const visibleTags =
    !needsTruncation || expanded ? allTags : allTags.slice(0, VISIBLE_COUNT);
  const hiddenCount = allTags.length - VISIBLE_COUNT;

  return (
    <div className="flex flex-wrap gap-2 mb-10">
      <Link href="/blog" className={`${pill} ${!activeTag ? pillActive : pillInactive}`}>
        All
      </Link>

      {visibleTags.map((tag) => (
        <Link
          key={tag}
          href={`/blog?tag=${encodeURIComponent(tag)}`}
          className={`${pill} ${activeTag === tag ? pillActive : pillInactive}`}
        >
          {tag}
        </Link>
      ))}

      {needsTruncation && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className={`${pill} ${pillInactive} cursor-pointer`}
        >
          {expanded ? "Show less" : `+${hiddenCount} more`}
        </button>
      )}
    </div>
  );
}
