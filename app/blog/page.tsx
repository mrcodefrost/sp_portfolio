import type { Metadata } from "next";
import {
  getAllTags,
  getPostsPaginated,
  getPostsPaginatedByTag,
  PAGE_SIZE,
} from "@/features/blog/services/queries";
import BlogListPage from "@/features/blog/components/BlogListPage";

export const metadata: Metadata = {
  title: "Writing | Daksh Nauni",
  description:
    "Technical articles on software engineering, system design, and things I find worth sharing.",
  openGraph: {
    title: "Writing | Daksh Nauni",
    description:
      "Technical articles on software engineering, system design, and things I find worth sharing.",
    type: "website",
  },
};

interface Props {
  searchParams: Promise<{ page?: string; tag?: string }>;
}

export default async function BlogPage({ searchParams }: Props) {
  const { page: pageParam, tag } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const activeTag = tag?.trim() || undefined;

  const [{ posts, total }, allTags] = await Promise.all([
    activeTag
      ? getPostsPaginatedByTag(activeTag, page)
      : getPostsPaginated(page),
    getAllTags(),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <BlogListPage
      posts={posts}
      currentPage={page}
      totalPages={totalPages}
      allTags={allTags}
      activeTag={activeTag}
    />
  );
}
