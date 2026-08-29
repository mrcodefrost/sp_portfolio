"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { fadeInUp, slideInFromLeft, slideInFromRight } from "@/utils/motion";
import VerticalCutReveal from "../sub/VerticalCutReveal";

interface ExperienceEntry {
  role: string;
  org: string;
  period: string;
  current?: boolean;
}

const EXPERIENCE: ExperienceEntry[] = [
  { role: "Founding Engineer", org: "StartupKaro", period: "Feb 2026 - Present", current: true },
  { role: "Founder", org: "Synrad Labs", period: "Ongoing" },
  { role: "Software Engineer", org: "CASA", period: "Aug 2025 - Jan 2026" },
  { role: "Associate Software Engineer", org: "Mind IT Systems", period: "Mar 2024 - Aug 2025" },
  { role: "Developer", org: "Hardik Singh & Company", period: "Sep 2023 - Nov 2023" },
  { role: "Automation Engineer", org: "ImpactQA", period: "Oct 2022 - Jun 2023" },
];

const STATS = [
  { value: "4+", label: "Years Experience" },
  { value: "19+", label: "Client Projects" },
];

const About = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: expRef, inView: expInView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <div
      ref={ref}
      id="about-me"
      className="relative flex flex-col items-center justify-center py-20 z-[20] w-full overflow-hidden"
    >
      <h1 className="text-[40px] font-semibold text-transparent bg-clip-text bg-linear-to-r from-purple-500 to-cyan-500 mb-10">
        <VerticalCutReveal
          autoStart={inView}
          splitBy="characters"
          staggerDuration={0.025}
          staggerFrom="first"
          containerClassName="justify-center"
          transition={{ type: "spring", stiffness: 200, damping: 21 }}
        >
          ABOUT ME
        </VerticalCutReveal>
      </h1>

      <div className="relative w-full max-w-5xl px-6 md:px-10 grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch">
        <motion.div
          variants={slideInFromLeft(0.15)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="md:col-span-2 min-w-0 relative"
        >
          <div className="absolute -inset-2 rounded-[28px] bg-linear-to-br from-purple-600/40 to-cyan-500/40 blur-xl opacity-60" />
          <div className="relative h-80 md:h-full rounded-2xl p-0.5 bg-linear-to-br from-purple-500 to-cyan-400 shadow-lg shadow-[#2A0E61]/50">
            <div className="relative h-full w-full rounded-[14px] overflow-hidden bg-[#030014]">
              <Image
                src="/dakshPortraitAbout.jpg"
                alt="Daksh Nauni"
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
                style={{ objectPosition: "50% calc(50% + 40px)" }}
                priority={false}
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 via-black/40 to-transparent p-5 flex items-start">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#7042f861] bg-[#0d0225]/80 px-3 py-1 text-xs text-gray-300 backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                  Open to new opportunities
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={slideInFromRight(0.15)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="md:col-span-3 min-w-0"
        >
          <div className="h-full flex flex-col justify-center gap-5 rounded-2xl border border-[#2A0E61] bg-[#0d0225]/40 backdrop-blur-sm p-8 text-center md:text-left">
            <p className="text-gray-400 text-base leading-relaxed">
              I&apos;m a full-stack and mobile engineer with 4 years of professional
              experience shipping production software, from web platforms
              handling real business operations to mobile apps live on the App Store and Play
              Store. I currently work as a Founding Engineer at StartupKaro, alongside running
              Synrad Labs, my own studio, where I&apos;ve independently delivered 19+ client
              projects across food and beverage, fintech, HR, and logistics.
            </p>

            <p className="text-gray-400 text-base leading-relaxed">
              I&apos;m based in India, comfortable overlapping with US and European working
              hours, and open to full-time remote roles, as well as relocating to the US,
              Europe, Australia, Singapore, or Japan for the right opportunity.
            </p>

            <div className="flex rounded-xl border border-[#2A0E61] bg-[#0d0225]/60">
              {STATS.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`flex-1 flex flex-col items-center md:items-start px-6 py-3 ${
                    index > 0 ? "border-l border-[#2A0E61]" : ""
                  }`}
                >
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-cyan-400">
                    {stat.value}
                  </span>
                  <span className="text-[11px] uppercase tracking-wide text-gray-500">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        ref={expRef}
        variants={fadeInUp(0.2)}
        initial="hidden"
        animate={expInView ? "visible" : "hidden"}
        className="relative w-full max-w-5xl px-6 md:px-10 mt-6"
      >
        <div className="rounded-2xl border border-[#2A0E61] bg-[#0d0225]/40 backdrop-blur-sm p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-purple-300 mb-6">
            Experience
          </p>

          <div className="relative pl-8 max-w-2xl">
            {(() => {
              const segments = EXPERIENCE.length - 1;
              const segDuration = 0.22;
              const startDelay = 0.15;
              return Array.from({ length: segments }, (_, i) => {
                const top = (i / segments) * 100;
                const segHeight = 100 / segments;
                const delay = startDelay + i * segDuration;
                return (
                  <div key={i}>
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={expInView ? { scaleY: 1 } : { scaleY: 0 }}
                      transition={{ duration: segDuration, ease: "easeOut", delay }}
                      style={{ transformOrigin: "top", top: `${top}%`, height: `${segHeight}%` }}
                      className="absolute left-1.75 w-px bg-linear-to-b from-purple-500 via-[#7042f861] to-transparent"
                    />
                    <motion.div
                      initial={{ top: `${top}%`, opacity: 0 }}
                      animate={
                        expInView
                          ? { top: `${top + segHeight}%`, opacity: [0, 1, 1, 0] }
                          : { top: `${top}%`, opacity: 0 }
                      }
                      transition={{ duration: segDuration, ease: "easeOut", delay }}
                      className="absolute left-1.75 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 blur-[3px] shadow-[0_0_10px_3px_rgba(103,232,249,0.8)] pointer-events-none"
                    />
                  </div>
                );
              });
            })()}

            {EXPERIENCE.map((entry, index) => {
              const dotDelay = 0.15 + index * 0.22;
              return (
                <motion.div
                  key={`${entry.role}-${entry.org}`}
                  variants={fadeInUp(0.05 * index)}
                  initial="hidden"
                  animate={expInView ? "visible" : "hidden"}
                  className="relative pb-7 last:pb-0"
                >
                  <span className="absolute -left-8 top-1 h-3.5 w-3.5">
                    <motion.span
                      initial={{ scale: 0, opacity: 0.9 }}
                      animate={expInView ? { scale: 2.6, opacity: 0 } : { scale: 0, opacity: 0.9 }}
                      transition={{ duration: 0.7, ease: "easeOut", delay: dotDelay }}
                      className={`absolute inset-0 rounded-full blur-[2px] ${
                        entry.current ? "bg-cyan-400" : "bg-purple-400"
                      }`}
                    />
                    {entry.current && (
                      <motion.span
                        animate={{ scale: [1, 1.9, 1], opacity: [0.55, 0, 0.55] }}
                        transition={{
                          duration: 2.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: dotDelay + 0.7,
                        }}
                        className="absolute inset-0 rounded-full bg-cyan-400 blur-[2px]"
                      />
                    )}
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={expInView ? { scale: 1 } : { scale: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 15,
                        delay: dotDelay,
                      }}
                      className={`relative block h-3.5 w-3.5 rounded-full border-2 ${
                        entry.current
                          ? "border-cyan-400 bg-cyan-400 shadow-[0_0_10px_2px_rgba(34,211,238,0.5)]"
                          : "border-[#7042f861] bg-[#030014]"
                      }`}
                    />
                  </span>
                  <div className="flex flex-wrap items-baseline gap-x-2.5">
                    <p className="text-white text-sm font-semibold">{entry.role}</p>
                    <span className="text-gray-500 text-xs">{entry.org}</span>
                    {entry.current && (
                      <span className="text-[10px] font-medium text-cyan-300 border border-cyan-400/30 bg-cyan-400/10 rounded-full px-2 py-0.5">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-0.5 text-gray-500">{entry.period}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
