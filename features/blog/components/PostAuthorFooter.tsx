import Link from "next/link";

export default function PostAuthorFooter() {
  return (
    <div className="border-t border-gray-200 dark:border-slate-800 mt-14 pt-10">
      <div className="flex items-start gap-4">
        {/* Initials avatar */}
        <div
          className="shrink-0 w-11 h-11 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center"
          aria-hidden="true"
        >
          <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
            DN
          </span>
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Daksh Nauni
          </p>
          <p className="text-[1rem] leading-relaxed text-gray-600 dark:text-slate-400 mb-3">
            Daksh likes developing softwares, hands on with mobile and web
            applications and backend systems.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-purple-600 dark:text-purple-400 hover:underline transition-colors"
            >
              View portfolio
            </Link>
            <Link
              href="/#contact"
              className="text-sm text-purple-600 dark:text-purple-400 hover:underline transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
