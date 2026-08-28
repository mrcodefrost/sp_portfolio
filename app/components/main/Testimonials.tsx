"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { fadeInUp } from "@/utils/motion";
import { TESTIMONIALS, Testimonial } from "@/constants/testimonials";
import SimpleMarquee from "@/app/components/sub/SimpleMarquee";
import VerticalCutReveal from "@/app/components/sub/VerticalCutReveal";

const avatarUrl = (name: string) =>
  `https://api.dicebear.com/10.x/critters/svg?seed=${encodeURIComponent(name)}&backgroundColor=000000`;

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <div className="relative flex h-70 w-90 shrink-0 flex-col overflow-hidden rounded-2xl border border-[#2A0E61] bg-[#0d0225]/40 backdrop-blur-sm p-6 transition-colors duration-300 hover:border-[#7042f88b]">
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
    <p className="relative flex-1 overflow-hidden text-gray-300 text-sm leading-relaxed line-clamp-5">
      &ldquo;{testimonial.quote}&rdquo;
    </p>
    <div className="relative mt-5 flex shrink-0 items-center gap-3 pt-4 border-t border-[#2A0E61]">
      <img
        src={avatarUrl(testimonial.name)}
        alt={testimonial.name}
        width={40}
        height={40}
        className="h-10 w-10 shrink-0 rounded-full bg-black"
      />
      <div className="min-w-0">
        <p className="text-white font-semibold text-sm truncate">{testimonial.name}</p>
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
