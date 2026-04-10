import Link from "next/link";
import type { PostSummary } from "../types";
import BlogCard from "./BlogCard";
import TagFilter from "./TagFilter";

interface BlogListPageProps {
  posts: PostSummary[];
  currentPage: number;
  totalPages: number;
  allTags: string[];
  activeTag?: string;
}

// Build the page numbers to show: always first/last, neighbours of current, with "…" gaps.
function buildPageRange(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set<number>([1, total, current - 1, current, current + 1]);
  // Remove out-of-range values
  for (const p of pages) {
    if (p < 1 || p > total) pages.delete(p);
  }

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const result: (number | "…")[] = [];

  for (let i = 0; i < sorted.length; i++) {
    result.push(sorted[i]);
    if (i < sorted.length - 1 && sorted[i + 1] - sorted[i] > 1) {
      result.push("…");
    }
  }

  return result;
}

export default function BlogListPage({
  posts,
  currentPage,
  totalPages,
  allTags,
  activeTag,
}: BlogListPageProps) {
  const pageRange = buildPageRange(currentPage, totalPages);

  function pageHref(p: number) {
    return activeTag ? `/blog?tag=${encodeURIComponent(activeTag)}&page=${p}` : `/blog?page=${p}`;
  }

  return (
    <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <header className="mb-14">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
          Writing
        </h1>
        <p className="text-lg text-gray-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Technical articles on software engineering, system design, and things
          I find worth sharing.
        </p>
      </header>

      {/* Tag filter */}
      <TagFilter allTags={allTags} activeTag={activeTag} />

      {/* Post grid */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <p className="text-2xl font-medium text-gray-300 dark:text-slate-600 mb-2">
            Nothing here yet
          </p>
          <p className="text-gray-400 dark:text-slate-600 text-sm">
            First post is brewing. Check back soon.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="mt-16 flex justify-center items-center gap-1.5"
        >
          {/* Previous */}
          {currentPage > 1 ? (
            <Link
              href={pageHref(currentPage - 1)}
              className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:border-purple-400 hover:text-purple-600 dark:hover:border-purple-600 dark:hover:text-purple-400 transition-colors text-sm"
              aria-label="Previous page"
            >
              ‹
            </Link>
          ) : (
            <span className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-100 dark:border-slate-800 text-gray-300 dark:text-slate-700 text-sm cursor-default">
              ‹
            </span>
          )}

          {/* Page number boxes */}
          {pageRange.map((item, idx) =>
            item === "…" ? (
              <span
                key={`ellipsis-${idx}`}
                className="flex items-center justify-center w-9 h-9 text-gray-400 dark:text-slate-600 text-sm"
              >
                …
              </span>
            ) : item === currentPage ? (
              <span
                key={item}
                aria-current="page"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-purple-600 text-white text-sm font-semibold"
              >
                {item}
              </span>
            ) : (
              <Link
                key={item}
                href={pageHref(item)}
                className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:border-purple-400 hover:text-purple-600 dark:hover:border-purple-600 dark:hover:text-purple-400 transition-colors text-sm"
              >
                {item}
              </Link>
            )
          )}

          {/* Next */}
          {currentPage < totalPages ? (
            <Link
              href={pageHref(currentPage + 1)}
              className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:border-purple-400 hover:text-purple-600 dark:hover:border-purple-600 dark:hover:text-purple-400 transition-colors text-sm"
              aria-label="Next page"
            >
              ›
            </Link>
          ) : (
            <span className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-100 dark:border-slate-800 text-gray-300 dark:text-slate-700 text-sm cursor-default">
              ›
            </span>
          )}
        </nav>
      )}
    </main>
  );
}
