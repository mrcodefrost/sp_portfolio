"use client";

export default function BlogError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Something went wrong
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
        Failed to load blog content. This may be a temporary issue — please try again.
      </p>
      <button
        onClick={reset}
        className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
      >
        Try again
      </button>
    </main>
  );
}
