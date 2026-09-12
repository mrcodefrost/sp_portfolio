"use client";

import { Lottie } from "lottie-react";
import { useReducedMotion } from "framer-motion";

import monsterAnimation from "@/public/monster.json";

const ContactFab = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="contact-fab-shell z-50">
      <span
        id="contact-fab-tooltip"
        role="tooltip"
        className="contact-fab-tooltip"
      >
        <span aria-hidden="true">✦</span> Tap to make contact!
      </span>

      <a
        href="#contact"
        aria-label="Go to contact form"
        aria-describedby="contact-fab-tooltip"
        className="contact-fab block rounded-full transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030014]"
      >
        <Lottie
          src={monsterAnimation}
          autoplay={!prefersReducedMotion}
          loop={!prefersReducedMotion}
          aria-hidden="true"
          className="h-full w-full drop-shadow-[0_8px_14px_rgba(42,14,97,0.65)]"
        />
      </a>
    </div>
  );
};

export default ContactFab;
