import Image from "next/image";
import type { Post } from "../types";
import { urlFor } from "../services/image";

interface BlogHeaderProps {
  post: Post;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogHeader({ post }: BlogHeaderProps) {
  const coverImageUrl = post.coverImage
    ? urlFor(post.coverImage).width(1600).height(900).fit("crop").url()
    : null;

  return (
    <header className="max-w-[720px] mx-auto px-4 sm:px-6 pt-12 pb-2">
      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-tight text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
        {post.title}
      </h1>

      {/* Subtitle */}
      {post.subtitle && (
        <p className="text-xl text-gray-500 dark:text-slate-400 leading-relaxed mb-8">
          {post.subtitle}
        </p>
      )}

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400 dark:text-slate-500 pb-8 border-b border-gray-200 dark:border-slate-800">
        {post.author && (
          <>
            <span className="font-medium text-gray-600 dark:text-slate-300">
              {post.author}
            </span>
            <span aria-hidden>·</span>
          </>
        )}
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        {post.updatedAt && (
          <>
            <span aria-hidden>·</span>
            <span>
              Updated{" "}
              <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
            </span>
          </>
        )}
        {post.estimatedReadingTime != null && (
          <>
            <span aria-hidden>·</span>
            <span>{post.estimatedReadingTime} min read</span>
          </>
        )}
      </div>

      {/* Cover image */}
      {coverImageUrl && (
        <div className="relative w-full aspect-[16/9] mt-8 rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800 shadow-sm">
          <Image
            src={coverImageUrl}
            alt={post.coverImage?.alt ?? post.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 720px"
          />
        </div>
      )}
    </header>
  );
}
