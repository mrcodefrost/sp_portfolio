export default function BlogLoading() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-12 text-center">
          <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg mx-auto mb-4 animate-pulse" />
          <div className="h-5 w-72 bg-gray-200 dark:bg-gray-800 rounded mx-auto animate-pulse" />
        </div>

        {/* Card grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-pulse"
            >
              <div className="h-48 bg-gray-200 dark:bg-gray-800" />
              <div className="p-5 space-y-3">
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded" />
                <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded" />
                <div className="flex gap-2 pt-2">
                  <div className="h-5 w-16 bg-gray-200 dark:bg-gray-800 rounded-full" />
                  <div className="h-5 w-16 bg-gray-200 dark:bg-gray-800 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
