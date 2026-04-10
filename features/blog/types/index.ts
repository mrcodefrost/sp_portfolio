import type { PortableTextBlock } from "@portabletext/types";

// ─── Sanity image primitives ──────────────────────────────────────────────────

export interface SanityImageAsset {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

export interface SanityImageWithAlt extends SanityImageAsset {
  alt: string;
  caption?: string;
}

// ─── Custom content block types ───────────────────────────────────────────────

export interface CodeBlockValue {
  _type: "codeBlock";
  _key: string;
  code: string;
  language?: string;
  filename?: string;
}

export interface ImageBlockValue {
  _type: "imageBlock";
  _key: string;
  image: SanityImageAsset;
  alt: string;
  caption?: string;
}

export interface YouTubeBlockValue {
  _type: "youtubeBlock";
  _key: string;
  url: string;
  caption?: string;
}

export type ContentBlock =
  | PortableTextBlock
  | CodeBlockValue
  | ImageBlockValue
  | YouTubeBlockValue;

// ─── Blog post types ──────────────────────────────────────────────────────────

export interface PostSummary {
  _id: string;
  title: string;
  slug: { current: string };
  subtitle?: string;
  publishedAt: string;
  author?: string;
  coverImage?: SanityImageWithAlt;
  tags?: string[];
  estimatedReadingTime?: number;
}

export interface Post extends PostSummary {
  body: ContentBlock[];
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: SanityImageAsset;
  updatedAt?: string;
  keywords?: string[];
  relatedPosts?: PostSummary[];
}

// ─── Table of contents ────────────────────────────────────────────────────────

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}
