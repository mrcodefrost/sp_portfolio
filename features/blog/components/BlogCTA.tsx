import Link from "next/link";

export default function BlogCTA() {
  return (
    <div className="mt-12 rounded-2xl border border-purple-100 dark:border-purple-900 bg-purple-50 dark:bg-purple-950/50 px-8 py-10 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-purple-500 dark:text-purple-400 mb-3">
        Work with me
      </p>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 tracking-tight">
        Building an app or web product?
      </h2>
      <p className="text-[1rem] leading-relaxed text-gray-600 dark:text-slate-400 max-w-md mx-auto mb-8">
        I work with startups and small teams to ship polished, performant web
        and mobile products. If you have something worth building, I&apos;d
        love to hear about it.
      </p>

      <Link
        href="/"
        className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-all duration-300 shadow-sm hover:shadow-purple-300/40 dark:hover:shadow-purple-900/40 mb-4"
      >
        View Portfolio
      </Link>

      <p className="text-sm text-gray-500 dark:text-slate-400">
        or{" "}
        <Link
          href="/#contact"
          className="text-purple-600 dark:text-purple-400 hover:underline transition-colors font-medium"
        >
          Get in touch
        </Link>
      </p>
    </div>
  );
}
