export default function BlogPostLoading() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 py-16 px-4">
      <div className="max-w-3xl mx-auto animate-pulse">
        {/* Cover image skeleton */}
        <div className="h-64 md:h-96 w-full bg-gray-200 dark:bg-gray-800 rounded-xl mb-10" />

        {/* Tags */}
        <div className="flex gap-2 mb-6">
          <div className="h-5 w-16 bg-gray-200 dark:bg-gray-800 rounded-full" />
          <div className="h-5 w-20 bg-gray-200 dark:bg-gray-800 rounded-full" />
        </div>

        {/* Title */}
        <div className="space-y-3 mb-6">
          <div className="h-9 w-full bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-9 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>

        {/* Subtitle */}
        <div className="h-5 w-2/3 bg-gray-200 dark:bg-gray-800 rounded mb-8" />

        {/* Author / meta row */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="space-y-2">
            <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
        </div>

        {/* Body lines */}
        <div className="space-y-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-gray-200 dark:bg-gray-800 rounded"
              style={{ width: `${70 + Math.round((i * 7) % 30)}%` }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
