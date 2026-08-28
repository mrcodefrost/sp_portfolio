"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { slideInFromLeft, slideInFromRight } from "@/utils/motion";
import Link from "next/link";
import VerticalCutReveal from "../sub/VerticalCutReveal";

const BlogTeaser = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section
      id="blog"
      ref={ref}
      className="flex flex-col items-center justify-center py-20 px-6 relative overflow-hidden z-20"
    >
      <h1 className="text-[40px] font-semibold text-transparent bg-clip-text bg-linear-to-r from-purple-500 to-cyan-500 mb-6 text-center">
        <VerticalCutReveal
          autoStart={inView}
          splitBy="characters"
          staggerDuration={0.025}
          staggerFrom="first"
          containerClassName="justify-center"
          transition={{ type: "spring", stiffness: 200, damping: 21 }}
        >
          WRITINGS
        </VerticalCutReveal>
      </h1>

      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={slideInFromLeft(0.15)}
        className="max-w-175 text-center"
      >
        <p className="text-gray-300 text-lg leading-relaxed mb-3">
          No fluff. No AI-generated content.
        </p>
        <p className="text-gray-400 text-base leading-relaxed">
          Things I actually run into while building, stuff like bugs that took too long to debug,
          patterns worth sharing, tools I&apos;ve explored, and ideas I&apos;ve prototyped along the way.
          <br />
          Written from experience, not from a prompt.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={slideInFromRight(0.3)}
        className="mt-10"
      >
        <Link
          href="/blog"
          className="py-3 px-8 button-primary text-center text-white cursor-pointer rounded-lg border border-[#7042f88b] text-sm font-medium transition-all duration-300"
        >
          Read the Blog
        </Link>
      </motion.div>
    </section>
  );
};

export default BlogTeaser;
