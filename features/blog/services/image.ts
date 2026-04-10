import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { getClient } from "./sanity-client";

// Builder is also lazy for the same reason — the client is a lazy singleton
export function urlFor(source: SanityImageSource) {
  return imageUrlBuilder(getClient()).image(source);
}
