"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { fadeInUp } from "@/utils/motion";
import { TESTIMONIALS, Testimonial } from "@/constants/testimonials";
import SimpleMarquee from "@/app/components/sub/SimpleMarquee";
import VerticalCutReveal from "@/app/components/sub/VerticalCutReveal";

const avatarUrl = (name: string) =>
  `https://api.dicebear.com/10.x/critters/svg?seed=${encodeURIComponent(name)}&backgroundColor=000000`;

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <div className="relative flex min-h-70 w-90 shrink-0 flex-col overflow-hidden rounded-2xl border border-[#2A0E61] bg-[#0d0225]/40 backdrop-blur-sm p-6 transition-colors duration-300 hover:border-[#7042f88b]">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={0.75}
      className="pointer-events-none absolute -top-4 -right-4 z-0 h-40 w-40 text-purple-400/15 select-none"
      aria-hidden="true"
    >
      <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
    </svg>
    <p className="relative flex-1 text-gray-300 text-sm leading-relaxed whitespace-pre-line">
      &ldquo;{testimonial.quote}&rdquo;
    </p>
    <div className="relative mt-5 flex shrink-0 items-center gap-3 pt-4 border-t border-[#2A0E61]">
      <Image
        src={avatarUrl(testimonial.name)}
        alt={testimonial.name}
        width={40}
        height={40}
        unoptimized
        className="h-10 w-10 shrink-0 rounded-full bg-black"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-white font-semibold text-sm truncate">{testimonial.name}</p>
          {testimonial.linkedin && (
            <a
              href={testimonial.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${testimonial.name} on LinkedIn`}
              className="shrink-0 text-gray-500 hover:text-purple-400 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          )}
        </div>
        {(testimonial.role || testimonial.company) && (
          <p className="text-gray-400 text-xs truncate">
            {[testimonial.role, testimonial.company].filter(Boolean).join(", ")}
          </p>
        )}
      </div>
    </div>
  </div>
);

const MarqueeRow = ({
  testimonials,
  direction,
}: {
  testimonials: Testimonial[];
  direction: "left" | "right";
}) => (
  <div className="marquee-fade w-full overflow-hidden">
    <SimpleMarquee
      direction={direction}
      baseVelocity={2}
      repeat={2}
      slowdownOnHover
      slowDownFactor={0.15}
      draggable
      dragSensitivity={0.3}
      dragVelocityDecay={0.94}
      grabCursor
    >
      <div className="flex gap-6 pr-6">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.name} testimonial={testimonial} />
        ))}
      </div>
    </SimpleMarquee>
  </div>
);

const Testimonials = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  if (TESTIMONIALS.length === 0) {
    return null;
  }

  const midpoint = Math.ceil(TESTIMONIALS.length / 2);
  const rowOne = TESTIMONIALS.slice(0, midpoint);
  const rowTwo = TESTIMONIALS.slice(midpoint);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center py-20 z-[20] overflow-hidden"
      id="testimonials"
    >
      <h1 className="text-[40px] font-semibold text-transparent bg-clip-text bg-linear-to-r from-purple-500 to-cyan-500 mb-10">
        <VerticalCutReveal
          autoStart={inView}
          splitBy="characters"
          staggerDuration={0.02}
          staggerFrom="first"
          containerClassName="justify-center"
          transition={{ type: "spring", stiffness: 200, damping: 21 }}
        >
          TESTIMONIALS
        </VerticalCutReveal>
      </h1>

      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeInUp(0.25)}
        className="w-full flex flex-col gap-6"
      >
        <MarqueeRow testimonials={rowOne} direction="left" />
        {rowTwo.length > 0 && <MarqueeRow testimonials={rowTwo} direction="right" />}
      </motion.div>
    </div>
  );
};

export default Testimonials;
