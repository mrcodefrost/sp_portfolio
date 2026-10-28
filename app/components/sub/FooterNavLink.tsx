"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { setHoveredBay } from "./bayHover";

interface FooterNavLinkProps {
  href: string;
  bay: string;
  className?: string;
  children: ReactNode;
}

// Footer nav link that highlights its matching docking bay in the station scene while hovered or focused.
export default function FooterNavLink({ href, bay, className, children }: FooterNavLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onMouseEnter={() => setHoveredBay(bay)}
      onMouseLeave={() => setHoveredBay(null)}
      onFocus={() => setHoveredBay(bay)}
      onBlur={() => setHoveredBay(null)}
    >
      {children}
    </Link>
  );
}
