import { createClient } from "next-sanity";
import type { SanityClient } from "next-sanity";

// Lazy singleton — deferred until first use so the client is never instantiated
// during a build where NEXT_PUBLIC_SANITY_PROJECT_ID is not set.
let _client: SanityClient | null = null;

export function getClient(): SanityClient {
  if (!_client) {
    _client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-01-01",
      useCdn: process.env.NODE_ENV === "production",
    });
  }
  return _client;
}
