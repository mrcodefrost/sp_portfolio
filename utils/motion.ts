// A gentle, near-critically-damped spring reads as "buttery" — it glides to rest
// instead of easing on a fixed clock, so it still feels natural at any interruption speed.
const SPRING = { type: "spring" as const, stiffness: 170, damping: 24, mass: 0.9 };

export function slideInFromLeft(delay: number = 0) {
  return {
    hidden: { x: -60, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { ...SPRING, delay },
    },
  };
}

export function slideInFromRight(delay: number = 0) {
  return {
    hidden: { x: 60, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { ...SPRING, delay },
    },
  };
}

export function slideInFromTop(delay: number = 0) {
  return {
    hidden: { y: -40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { ...SPRING, delay },
    },
  };
}

export function fadeInUp(delay: number = 0) {
  return {
    hidden: { y: 56, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { ...SPRING, delay, stiffness: 130 },
    },
  };
}

// Wrap a group of children with this on the parent (initial/animate) so each
// child (using `fadeInUp()`/etc as its own variants, no per-child delay needed)
// reveals one by one instead of all at once.
export function staggerContainer(staggerChildren: number = 0.12, delayChildren: number = 0) {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };
}
