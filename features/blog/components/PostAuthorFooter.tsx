import Image from "next/image";
import Link from "next/link";

export default function PostAuthorFooter() {
  return (
    <div className="border-t border-gray-200 dark:border-slate-800 mt-14 pt-10">
      <div className="flex items-start gap-4">
        {/* Portrait avatar */}
        <div
          className="shrink-0 w-20 h-20 rounded-full border-2 border-purple-200 dark:border-purple-800 overflow-hidden"
          aria-hidden="true"
        >
          <Image
            src="/daksh_portrait.jpg"
            alt="Daksh Nauni"
            width={400}
            height={400}
            className="w-full h-full object-cover object-top"
            quality={100}
          />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Daksh Nauni
          </p>
          <p className="text-[1rem] leading-relaxed text-gray-600 dark:text-slate-400 mb-3">
            I am a software engineer who enjoys building mobile apps, web platforms, and backend systems.
            This blog is where I share what I learn while building real projects, from debugging weird errors to shipping features that actually matter.
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
