"use client";

import { createContext, useContext, useEffect, useState } from "react";

// ─── Context ──────────────────────────────────────────────────────────────────

interface BlogThemeContextValue {
  isDark: boolean;
  toggle: () => void;
}

const BlogThemeContext = createContext<BlogThemeContextValue>({
  isDark: false,
  toggle: () => {},
});

export function useBlogTheme(): BlogThemeContextValue {
  return useContext(BlogThemeContext);
}

// ─── Provider + wrapper ───────────────────────────────────────────────────────

export default function BlogThemeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDark, setIsDark] = useState(false);

  // Hydrate from localStorage after mount to avoid SSR mismatch
  useEffect(() => {
    const saved = localStorage.getItem("blog-theme");
    if (saved === "dark") setIsDark(true);
  }, []);

  const toggle = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem("blog-theme", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <BlogThemeContext.Provider value={{ isDark, toggle }}>
      {/*
        suppressHydrationWarning: the `dark` class is added client-side after
        hydration, so it won't match the server-rendered HTML — that's expected.
      */}
      <div className={isDark ? "dark" : ""} suppressHydrationWarning>
        <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
          {children}
        </div>
      </div>
    </BlogThemeContext.Provider>
  );
}
