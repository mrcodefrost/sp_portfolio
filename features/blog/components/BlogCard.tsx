import Link from "next/link";
import Image from "next/image";
import type { PostSummary } from "../types";
import { urlFor } from "../services/image";

interface BlogCardProps {
  post: PostSummary;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogCard({ post }: BlogCardProps) {
  const coverImageUrl = post.coverImage
    ? urlFor(post.coverImage).width(800).height(450).fit("crop").url()
    : null;

  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="group flex flex-col bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-xl hover:shadow-purple-100/60 dark:hover:shadow-purple-950/20 transition-all duration-300"
    >
      {/* Cover image */}
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-slate-800">
        {coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt={post.coverImage?.alt ?? post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          /* Placeholder gradient when no cover image */
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-950/40 dark:to-indigo-950/40" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-snug">
          {post.title}
        </h2>

        {/* Subtitle */}
        {post.subtitle && (
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed flex-1">
            {post.subtitle}
          </p>
        )}

        {/* Meta footer */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-slate-800">
          <time
            className="text-xs text-gray-400 dark:text-slate-500"
            dateTime={post.publishedAt}
          >
            {formatDate(post.publishedAt)}
          </time>
          {post.estimatedReadingTime != null && (
            <span className="text-xs text-gray-400 dark:text-slate-500">
              {post.estimatedReadingTime} min read
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
