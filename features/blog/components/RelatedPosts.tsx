import type { Post } from "../types";
import { getLatestPostsExcluding } from "../services/queries";
import BlogCard from "./BlogCard";

interface RelatedPostsProps {
  post: Post;
}

export default async function RelatedPosts({ post }: RelatedPostsProps) {
  const related =
    post.relatedPosts && post.relatedPosts.length > 0
      ? post.relatedPosts.slice(0, 3)
      : await getLatestPostsExcluding(post.slug.current, 3);

  if (related.length === 0) return null;

  return (
    <section
      aria-labelledby="related-posts-heading"
      className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-16 pb-24"
    >
      <div className="mb-8">
        <h2
          id="related-posts-heading"
          className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight"
        >
          Related Articles
        </h2>
        <div className="mt-2 h-px w-12 bg-purple-400 dark:bg-purple-600 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.map((relatedPost) => (
          <BlogCard key={relatedPost._id} post={relatedPost} />
        ))}
      </div>
    </section>
  );
}
