import Link from "next/link";
import { SOCIALS } from "@/constants/socials";

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
              Full-Stack &amp; Mobile Engineer building web platforms and
              production mobile apps end to end.
            </p>
            <div className="flex items-center gap-4 mt-5">
              {SOCIALS.map((link) => (
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
          <p className={s.copy}>© {new Date().getFullYear()} Daksh Nauni. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}