import StudioPageClient from "./StudioPageClient";

export { metadata, viewport } from "next-sanity/studio";

// Studio is pure client-side — never statically pre-render this route
export const dynamic = "force-dynamic";

export default function StudioPage() {
  return <StudioPageClient />;
}
