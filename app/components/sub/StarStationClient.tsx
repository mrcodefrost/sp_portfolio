"use client";

import dynamic from "next/dynamic";
import { useInView } from "react-intersection-observer";

const FOOTPRINT = "aspect-[4/3] w-full lg:aspect-[7/3]";

// The three.js bundle is only fetched once the footer is near the viewport, so it never competes with
// the hero for bandwidth or main-thread time. The placeholder reserves the canvas footprint, so nothing jumps.
const StarStation = dynamic(() => import("./StarStation"), {
  ssr: false,
  loading: () => <div className={FOOTPRINT} />,
});

export default function StarStationClient() {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "800px 0px" });

  return <div ref={ref}>{inView ? <StarStation /> : <div className={FOOTPRINT} />}</div>;
}
