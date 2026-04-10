import { Suspense } from "react";
import type { Post } from "../types";
import { extractTOC } from "../lib/toc";
import { preprocessCodeBlocks } from "../lib/code-highlight";
import BlogHeader from "./BlogHeader";
import ReadingProgress from "./ReadingProgress";
import TableOfContents from "./TableOfContents";
import PortableTextRenderer from "./blocks/PortableTextRenderer";
import PostAuthorFooter from "./PostAuthorFooter";
import BlogCTA from "./BlogCTA";
import RelatedPosts from "./RelatedPosts";

interface BlogPostPageProps {
  post: Post;
}

export default async function BlogPostPage({ post }: BlogPostPageProps) {
  const toc = extractTOC(post.body);
  // Syntax highlighting is server-side — pre-process code blocks before
  // handing the body to the (client) PortableTextRenderer.
  const processedBody = await preprocessCodeBlocks(post.body);

  return (
    <>
      {/* Fixed reading-progress bar (client) */}
      <ReadingProgress />

      {/* Post header: title, meta, cover image */}
      <BlogHeader post={post} />

      {/* Article body + optional sticky TOC sidebar */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 pb-16 pt-2">
        <div className="flex gap-14 justify-center">
          {/* ── Main article ─────────────────────────────────────── */}
          <article className="w-full max-w-[720px] min-w-0">
            <PortableTextRenderer body={processedBody} />
            <PostAuthorFooter />
            <BlogCTA />
          </article>

          {/* ── Sticky TOC — only on very wide screens ────────────── */}
          {toc.length > 1 && (
            <aside className="hidden xl:block w-56 shrink-0">
              <div className="sticky top-24">
                <TableOfContents items={toc} />
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* ── Related posts — full container width, outside article ─────── */}
      <Suspense fallback={null}>
        <RelatedPosts post={post} />
      </Suspense>
    </>
  );
}
