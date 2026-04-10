import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug, getAllPostSlugs } from "@/features/blog/services/queries";
import BlogPostPage from "@/features/blog/components/BlogPostPage";
import { urlFor } from "@/features/blog/services/image";

interface Props {
  params: Promise<{ slug: string }>;
}

// Allow on-demand rendering of slugs not generated at build time
export const dynamicParams = true;

// Pre-render all known slugs at build time
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Dynamic SEO metadata per post
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return { title: "Post Not Found | Daksh Nauni" };

  const ogImageUrl =
    post.ogImage
      ? urlFor(post.ogImage).width(1200).height(630).fit("crop").url()
      : post.coverImage
      ? urlFor(post.coverImage).width(1200).height(630).fit("crop").url()
      : undefined;

  const title = post.seoTitle ?? post.title;
  const description = post.seoDescription ?? post.subtitle;

  return {
    title: `${title} | Daksh Nauni`,
    description,
    keywords: post.keywords,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : undefined,
      images: ogImageUrl
        ? [{ url: ogImageUrl, width: 1200, height: 630, alt: title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}

export default async function BlogPostRoute({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return <BlogPostPage post={post} />;
}
