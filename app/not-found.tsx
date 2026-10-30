import Link from "next/link";
import type { Metadata } from "next";
import StarBackgroundClient from "./components/main/StarBackgroundClient";
import PipeGame from "./components/sub/PipeGame";

export const metadata: Metadata = {
  title: "Signal lost",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#030014]">
      <StarBackgroundClient />
      <main className="relative z-20 mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-10 px-6 py-16 md:flex-row md:gap-16">
        <div className="text-center md:text-left">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300/70">
            Error 404 // Sector not found
          </p>
          <h1 className="mt-3 bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-7xl font-bold text-transparent md:text-8xl">
            404
          </h1>
          <h2 className="mt-2 text-2xl font-semibold text-gray-100">Signal lost</h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-gray-400 md:mx-0">
            This page drifted out of range, or was never on the map. While you&apos;re out here,
            re-establish the link: turn the pipes to route power from the generator to the
            dead page.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            <Link
              href="/"
              className="button-primary cursor-pointer rounded-lg border border-[#7042f88b] px-8 py-3 text-sm font-medium text-white transition-all duration-300"
            >
              Return to base
            </Link>
            <Link
              href="/blog"
              className="cursor-pointer rounded-lg border border-white/15 px-8 py-3 text-sm font-medium text-gray-300 transition-colors hover:border-purple-400/60 hover:text-white"
            >
              Read the blog
            </Link>
          </div>
        </div>

        <div className="w-full max-w-md shrink-0">
          <PipeGame />
        </div>
      </main>
    </div>
  );
}
