"use client";

import Link from "next/link";
import DarkModeToggle from "./DarkModeToggle";

export default function BlogNavbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm border-b border-gray-200 dark:border-slate-800">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Left: breadcrumb nav */}
        <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
          <Link
            href="/"
            className="flex items-center gap-1 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Portfolio
          </Link>
          <span className="text-gray-300 dark:text-slate-700 select-none">/</span>
          <Link
            href="/blog"
            className="font-medium text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            Writing
          </Link>
        </nav>

        {/* Right: dark mode toggle */}
        <DarkModeToggle />
      </div>
    </header>
  );
}
