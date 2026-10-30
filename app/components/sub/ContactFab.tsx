"use client";

import { useEffect, useState, type ComponentType } from "react";
import { useReducedMotion } from "framer-motion";

type LottieProps = {
  src: unknown;
  autoplay?: boolean;
  loop?: boolean;
  className?: string;
  "aria-hidden"?: boolean;
};

const ContactFab = () => {
  const prefersReducedMotion = useReducedMotion();
  const [lottie, setLottie] = useState<{ Lottie: ComponentType<LottieProps>; data: unknown } | null>(null);

  // The animation is decoration, so it must not compete with the hero: fetch the player and its JSON
  // once the browser is idle. The button is already usable (and sized by CSS) before it arrives.
  useEffect(() => {
    let cancelled = false;
    const load = () =>
      Promise.all([import("lottie-react"), import("@/public/monster.json")]).then(([lib, data]) => {
        if (!cancelled) setLottie({ Lottie: lib.Lottie as ComponentType<LottieProps>, data: data.default });
      });
    // Safari has no requestIdleCallback, so fall back to a short timer
    const hasIdle = "requestIdleCallback" in window;
    const handle = hasIdle ? window.requestIdleCallback(() => void load(), { timeout: 4000 }) : window.setTimeout(() => void load(), 2000);
    return () => {
      cancelled = true;
      if (hasIdle) window.cancelIdleCallback(handle);
      else clearTimeout(handle);
    };
  }, []);

  return (
    <div className="contact-fab-shell z-50">
      <a
        href="#contact"
        aria-label="Go to contact form"
        aria-describedby="contact-fab-tooltip"
        className="contact-fab block rounded-full transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030014]"
      >
        {lottie && (
          <lottie.Lottie
            src={lottie.data}
            autoplay={!prefersReducedMotion}
            loop={!prefersReducedMotion}
            aria-hidden={true}
            className="h-full w-full drop-shadow-[0_8px_14px_rgba(42,14,97,0.65)]"
          />
        )}
      </a>

      <span
        id="contact-fab-tooltip"
        role="tooltip"
        className="contact-fab-tooltip"
      >
        <span aria-hidden="true">✦</span> Tap to make contact!
      </span>
    </div>
  );
};

export default ContactFab;
