"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { fadeInUp } from "@/utils/motion";

const GITHUB_USERNAME = "mrcodefrost";

const GithubActivity = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeInUp(0.1)}
      className="w-full"
    >
      <div className="rounded-2xl border border-[#2A0E61] bg-[#0d0225]/40 backdrop-blur-sm p-6 transition-colors duration-300 hover:border-[#7042f88b]">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-purple-300">
            GitHub Activity
          </p>
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer text-xs text-gray-400 hover:text-purple-400 transition-colors"
          >
            View profile &rarr;
          </a>
        </div>
        <div className="overflow-x-auto">
          <Image
            src={`https://ghchart.rshah.org/8b26eb/${GITHUB_USERNAME}`}
            alt={`${GITHUB_USERNAME}'s GitHub contribution graph`}
            width={720}
            height={112}
            unoptimized
            className="w-full min-w-[640px] h-auto"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default GithubActivity;
