import { getClient } from "./sanity-client";
import type { Post, PostSummary } from "../types";

export const PAGE_SIZE = 12;

// Prefer the manually-set readTime field; fall back to auto-computing from body length.
const POST_SUMMARY_FIELDS = `
  _id,
  title,
  slug,
  subtitle,
  publishedAt,
  author,
  coverImage { ..., "alt": coalesce(alt, asset->altText, "") },
  tags,
  "estimatedReadingTime": coalesce(readTime, round(length(pt::text(body)) / 5 / 200))
`;

function isSanityConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
}

/** Returns one page of posts and the total post count. */
export async function getPostsPaginated(
  page: number
): Promise<{ posts: PostSummary[]; total: number }> {
  if (!isSanityConfigured()) return { posts: [], total: 0 };

  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const [posts, total] = await Promise.all([
    getClient().fetch<PostSummary[]>(
      `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) [$start...$end] {
        ${POST_SUMMARY_FIELDS}
      }`,
      { start, end },
      { next: { revalidate: 60 } }
    ),
    getClient().fetch<number>(
      `count(*[_type == "post" && defined(slug.current)])`,
      {},
      { next: { revalidate: 60 } }
    ),
  ]);

  return { posts, total };
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!isSanityConfigured()) return null;
  return getClient().fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      ${POST_SUMMARY_FIELDS},
      body,
      seoTitle,
      seoDescription,
      ogImage,
      updatedAt,
      keywords,
      "relatedPosts": relatedPosts[]->{
        ${POST_SUMMARY_FIELDS}
      }
    }`,
    { slug },
    { next: { revalidate: 60 } }
  );
}

/**
 * Returns up to `count` most-recent published posts, excluding the post
 * with the given slug. Used as a fallback for RelatedPosts when no
 * manually curated related posts are set.
 */
export async function getLatestPostsExcluding(
  currentSlug: string,
  count: number
): Promise<PostSummary[]> {
  if (!isSanityConfigured()) return [];
  return getClient().fetch<PostSummary[]>(
    `*[_type == "post" && defined(slug.current) && slug.current != $currentSlug]
      | order(publishedAt desc) [0...$count] {
        ${POST_SUMMARY_FIELDS}
      }`,
    { currentSlug, count },
    { next: { revalidate: 60 } }
  );
}

/** Returns all unique tags across published posts, sorted alphabetically. */
export async function getAllTags(): Promise<string[]> {
  if (!isSanityConfigured()) return [];
  const tags = await getClient().fetch<string[]>(
    `array::unique(*[_type == "post" && defined(slug.current) && defined(tags)].tags[])`,
    {},
    { next: { revalidate: 60 } }
  );
  return (tags ?? []).sort();
}

/** Returns one page of posts filtered by a specific tag, plus the total count. */
export async function getPostsPaginatedByTag(
  tag: string,
  page: number
): Promise<{ posts: PostSummary[]; total: number }> {
  if (!isSanityConfigured()) return { posts: [], total: 0 };

  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const [posts, total] = await Promise.all([
    getClient().fetch<PostSummary[]>(
      `*[_type == "post" && defined(slug.current) && $tagFilter in tags] | order(publishedAt desc) [$start...$end] {
        ${POST_SUMMARY_FIELDS}
      }`,
      { tagFilter: tag, start, end },
      { next: { revalidate: 60 } }
    ),
    getClient().fetch<number>(
      `count(*[_type == "post" && defined(slug.current) && $tagFilter in tags])`,
      { tagFilter: tag },
      { next: { revalidate: 60 } }
    ),
  ]);

  return { posts, total };
}

export async function getAllPostSlugs(): Promise<string[]> {
  if (!isSanityConfigured()) return [];
  const results = await getClient().fetch<{ slug: { current: string } }[]>(
    `*[_type == "post" && defined(slug.current)] { slug }`
  );
  return results.map((r) => r.slug.current);
}
