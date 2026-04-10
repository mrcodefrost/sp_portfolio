import Link from "next/link";

type Variant = "space" | "clean";

interface SiteFooterProps {
  variant?: Variant;
}

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/#projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
] as const;

const SOCIAL_LINKS = [
  {
    name: "GitHub",
    href: "https://github.com/mrcodefrost",
    icon: (
      <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/daksh-nauni-69a470208/",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "Email",
    href: "mailto:mr.codefrost@gmail.com",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
] as const;

const styles = {
  space: {
    wrapper: "relative z-[30] bg-[#03001408] backdrop-blur-xs border-t border-[#7042f861]",
    name: "text-white font-semibold text-base",
    bio: "text-gray-400 text-sm leading-relaxed",
    heading: "text-gray-300 text-xs font-semibold uppercase tracking-widest mb-3",
    navLink: "text-gray-400 text-sm hover:text-purple-400 transition-colors",
    social: "text-gray-400 hover:text-purple-400 transition-colors",
    divider: "border-t border-[#7042f861]",
    copy: "text-gray-500 text-xs",
  },
  clean: {
    wrapper: "border-t border-gray-200 dark:border-slate-800",
    name: "text-gray-900 dark:text-gray-100 font-semibold text-base",
    bio: "text-gray-500 dark:text-slate-400 text-sm leading-relaxed",
    heading: "text-gray-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3",
    navLink: "text-gray-600 dark:text-gray-300 text-sm hover:text-purple-600 dark:hover:text-purple-400 transition-colors",
    social: "text-gray-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors",
    divider: "border-t border-gray-200 dark:border-slate-800",
    copy: "text-gray-400 dark:text-slate-500 text-xs",
  },
} as const;

export default function SiteFooter({ variant = "clean" }: SiteFooterProps) {
  const s = styles[variant];

  return (
    <footer className={s.wrapper}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          {/* Brand + socials */}
          <div className="max-w-xs">
            <p className={s.name}>Daksh Nauni</p>
            <p className={`${s.bio} mt-2`}>
              A Senior Software Engineer developing softwares, hands on with
              mobile and web applications and backend systems.
            </p>
            <div className="flex items-center gap-4 mt-5">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target={link.href.startsWith("mailto") ? undefined : "_blank"}
                  rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                  aria-label={link.name}
                  className={s.social}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className={s.heading}>Navigation</p>
            <nav aria-label="Footer navigation">
              <ul className="flex flex-col gap-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={s.navLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className={s.divider}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-4">
          <p className={s.copy}>© 2026 Daksh Nauni. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}