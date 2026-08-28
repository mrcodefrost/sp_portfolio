"use client";

import React, { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { fadeInUp, slideInFromTop, staggerContainer } from "@/utils/motion";
import ProjectCard from "../sub/ProjectCard";
import VerticalCutReveal from "../sub/VerticalCutReveal";
import { PROJECTS, ProjectCategory } from "@/constants/projects";

type Filter = "all" | ProjectCategory;

const FILTERS: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Web", value: "web" },
  { label: "Mobile", value: "mobile" },
];

const INITIAL_DESKTOP = 6;
const INITIAL_MOBILE = 3;
const ROW_SIZE = 3;

const pill =
  "text-sm font-medium px-4 py-1.5 rounded-full border cursor-pointer transition-all duration-300";
const pillActive =
  "text-white border-transparent bg-linear-to-r from-purple-500 to-cyan-500";
const pillInactive =
  "border-[#7042f88b] text-gray-300 hover:text-white hover:border-[#8b26eb]";

const Projects = () => {
  const [expanded, setExpanded] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [fabOpen, setFabOpen] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  // Only counts as "on screen" once a meaningful chunk of the section has
  // actually scrolled into view — not the instant a single pixel peeks in
  // from the bottom edge while the user is still mostly looking at Hero.
  const { ref: sectionTrackRef, inView: sectionOnScreen } = useInView({
    threshold: 0,
    rootMargin: "-65px 0px -60% 0px",
  });
  const setSectionRef = useCallback(
    (node: HTMLDivElement | null) => {
      ref(node);
      sectionTrackRef(node);
    },
    [ref, sectionTrackRef]
  );

  const visibleProjects =
    filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  const projectsToRender = expanded
    ? visibleProjects
    : visibleProjects.slice(0, INITIAL_DESKTOP);

  const rows = [];
  for (let i = 0; i < projectsToRender.length; i += ROW_SIZE) {
    rows.push(projectsToRender.slice(i, i + ROW_SIZE));
  }

  const handleFilterChange = (value: Filter) => {
    setFilter(value);
  };

  return (
    <div
      ref={setSectionRef}
      className="flex flex-col items-center justify-center py-20 z-[20]"
      id="projects"
    >
      <h1 className="text-[40px] font-semibold text-transparent bg-clip-text bg-linear-to-r from-purple-500 to-cyan-500 mb-6">
        <VerticalCutReveal
          autoStart={inView}
          splitBy="characters"
          staggerDuration={0.03}
          staggerFrom="first"
          containerClassName="justify-center"
          transition={{ type: "spring", stiffness: 200, damping: 21 }}
        >
          PROJECTS
        </VerticalCutReveal>
      </h1>

      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={slideInFromTop(0.15)}
        className="hidden md:flex gap-3 mb-10"
      >
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => handleFilterChange(value)}
            className={`${pill} ${filter === value ? pillActive : pillInactive}`}
          >
            {label}
          </button>
        ))}
      </motion.div>

      <div className="w-full max-w-screen-xl mx-auto flex flex-col gap-10 px-10">
        {rows.map((row, rowIndex) => (
          <motion.div
            key={row.map((p) => p.title).join("-")}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer(0.18)}
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {row.map((project, indexInRow) => {
              const index = rowIndex * ROW_SIZE + indexInRow;
              let className = "flex";
              if (!expanded) {
                if (index >= INITIAL_DESKTOP) {
                  className = "hidden";
                } else if (index >= INITIAL_MOBILE) {
                  className = "hidden md:flex";
                }
              }
              return (
                <motion.div key={project.title} variants={fadeInUp()} className={className}>
                  <ProjectCard {...project} />
                </motion.div>
              );
            })}
          </motion.div>
        ))}
      </div>

      {!expanded && visibleProjects.length > INITIAL_DESKTOP && (
        <motion.button
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeInUp()}
          onClick={() => setExpanded(true)}
          className="mt-12 py-3 px-8 button-primary text-center text-white cursor-pointer rounded-lg border border-[#7042f88b] text-sm font-medium transition-colors duration-300"
        >
          View More Projects
        </motion.button>
      )}

      {sectionOnScreen && (
        <div className="md:hidden fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
          <AnimatePresence>
            {fabOpen && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                className="flex flex-col gap-2 rounded-2xl border border-[#7042f861] bg-[#0d0225]/95 backdrop-blur-md p-3 shadow-lg shadow-[#2A0E61]/40"
              >
                {FILTERS.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => {
                      handleFilterChange(value);
                      setFabOpen(false);
                    }}
                    className={`${pill} ${filter === value ? pillActive : pillInactive} text-left`}
                  >
                    {label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setFabOpen((open) => !open)}
            aria-label="Filter projects"
            aria-expanded={fabOpen}
            className="button-primary flex h-14 w-14 items-center justify-center rounded-full border border-[#7042f88b] text-white shadow-lg shadow-[#2A0E61]/50 transition-colors duration-300"
          >
            {fabOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <FunnelIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Projects;
