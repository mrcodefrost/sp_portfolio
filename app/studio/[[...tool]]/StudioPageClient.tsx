"use client";

import dynamic from "next/dynamic";

// Load the entire studio — config and all — purely client-side.
// This prevents Sanity's browser-only code from being evaluated server-side
// during Next.js build-time page data collection.
const Studio = dynamic(
  async () => {
    const { NextStudio } = await import("next-sanity/studio");
    const config = (await import("@/sanity.config")).default;
    function SanityStudio() {
      return <NextStudio config={config} />;
    }
    return SanityStudio;
  },
  { ssr: false, loading: () => null }
);

export default function StudioPageClient() {
  return <Studio />;
}
