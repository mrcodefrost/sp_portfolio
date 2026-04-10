import Link from "next/link";

export default function BlogPostNotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <p className="text-6xl font-bold text-gray-200 dark:text-slate-800 mb-4 select-none">
        404
      </p>
      <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Post not found
      </h1>
      <p className="text-gray-500 dark:text-slate-400 mb-8 text-sm max-w-sm">
        This post doesn&apos;t exist or may have been removed.
      </p>
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        ← Back to Writing
      </Link>
    </main>
  );
}
