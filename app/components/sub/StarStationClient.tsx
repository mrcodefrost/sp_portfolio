"use client";

import dynamic from "next/dynamic";

// Reserves the canvas footprint while the three.js bundle loads, so the footer does not jump.
const StarStation = dynamic(() => import("./StarStation"), {
  ssr: false,
  loading: () => <div className="aspect-[4/3] w-full lg:aspect-[2/1]" />,
});

export default function StarStationClient() {
  return <StarStation />;
}
