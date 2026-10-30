import Link from "next/link";
import Image from "next/image";
import type { PostSummary } from "@/features/blog/types";
import { urlFor } from "@/features/blog/services/image";

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const BlogPreviewCard = ({ post }: { post: PostSummary }) => {
  const cover = post.coverImage
    ? urlFor(post.coverImage).width(800).height(450).fit("crop").url()
    : null;

  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="group flex w-full flex-col overflow-hidden rounded-2xl border border-[#7042f861] bg-[#03001430] text-left backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/60 hover:shadow-lg hover:shadow-[#2A0E61]/50"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#0d0225]">
        {cover ? (
          <Image
            src={cover}
            alt={post.coverImage?.alt || post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-cyan-900/30" />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {post.tags && post.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#7042f861] bg-[#0d0225]/70 px-2.5 py-0.5 text-xs text-purple-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h3 className="mb-2 text-lg font-semibold leading-snug text-gray-100 transition-colors group-hover:text-purple-300">
          {post.title}
        </h3>

        {post.subtitle && (
          <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-gray-400">
            {post.subtitle}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-3 text-xs text-gray-500">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          {post.estimatedReadingTime != null && <span>{post.estimatedReadingTime} min read</span>}
        </div>
      </div>
    </Link>
  );
};

export default BlogPreviewCard;
