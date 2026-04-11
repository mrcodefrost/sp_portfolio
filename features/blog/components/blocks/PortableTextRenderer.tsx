"use client";

import { useState } from "react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { ContentBlock, ImageBlockValue, YouTubeBlockValue } from "../../types";
import type { ProcessedCodeBlock } from "../../lib/code-highlight";
import { slugifyHeading } from "../../lib/toc";
import ImageBlock from "./ImageBlock";
import YouTubeBlock from "./YouTubeBlock";

interface PortableTextRendererProps {
  body: ContentBlock[];
}

// ─── Code block (pre-highlighted HTML injected by server) ─────────────────────

function RenderedCodeBlock({ value }: { value: ProcessedCodeBlock }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard API unavailable — silently ignore
    }
  };

  return (
    <div className="my-8 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-[#f6f8fa] dark:bg-[#0d1117] text-sm not-prose">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-slate-700 bg-[#f0f2f4] dark:bg-[#161b22]">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex items-center gap-3">
          {value.filename && (
            <span className="font-mono text-xs text-gray-500 dark:text-slate-400">
              {value.filename}
            </span>
          )}
          {value.language && value.language !== "text" && (
            <span className="text-xs text-gray-400 dark:text-slate-500 capitalize">
              {value.language}
            </span>
          )}
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? "Copied" : "Copy code"}
            className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Highlighted code */}
      <div
        className="overflow-x-auto [&>pre]:p-5 [&>pre]:m-0 [&>pre]:leading-relaxed [&>pre]:text-[0.875rem] [&>pre]:min-w-max"
        dangerouslySetInnerHTML={{ __html: value._highlightedHtml }}
      />
    </div>
  );
}

// ─── Helper: extract plain text + build anchor id from a block ────────────────

function getHeadingId(value: { children?: { _type: string; text: string }[] }): string {
  const text = (value.children ?? [])
    .filter((c) => c._type === "span")
    .map((c) => c.text)
    .join("");
  return slugifyHeading(text);
}

// ─── PortableText component map ───────────────────────────────────────────────

const components: PortableTextComponents = {
  // ── Custom block types ──────────────────────────────────────────────────────
  types: {
    codeBlock: ({ value }) => (
      <RenderedCodeBlock value={value as ProcessedCodeBlock} />
    ),
    imageBlock: ({ value }) => <ImageBlock value={value as ImageBlockValue} />,
    youtubeBlock: ({ value }) => (
      <YouTubeBlock value={value as YouTubeBlockValue} />
    ),
  },

  // ── Text block styles ───────────────────────────────────────────────────────
  block: {
    normal: ({ children }) => (
      <p className="text-[1.1rem] leading-[1.85] text-gray-700 dark:text-slate-300 mb-6">
        {children}
      </p>
    ),
    h2: ({ children, value }) => (
      <h2
        id={getHeadingId(value as Parameters<typeof getHeadingId>[0])}
        className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-14 mb-4 scroll-mt-24"
      >
        {children}
      </h2>
    ),
    h3: ({ children, value }) => (
      <h3
        id={getHeadingId(value as Parameters<typeof getHeadingId>[0])}
        className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-10 mb-3 scroll-mt-24"
      >
        {children}
      </h3>
    ),
    h4: ({ children, value }) => (
      <h4
        id={getHeadingId(value as Parameters<typeof getHeadingId>[0])}
        className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-3 scroll-mt-24"
      >
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-purple-400 dark:border-purple-600 pl-6 pr-4 py-1 my-8 bg-purple-50 dark:bg-purple-950/30 rounded-r-lg">
        <p className="text-gray-600 dark:text-slate-300 italic text-lg leading-relaxed m-0">
          {children}
        </p>
      </blockquote>
    ),
  },

  // ── Lists ───────────────────────────────────────────────────────────────────
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-outside pl-6 space-y-2 mb-6 text-gray-700 dark:text-slate-300 text-[1.05rem] leading-relaxed">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-outside pl-6 space-y-2 mb-6 text-gray-700 dark:text-slate-300 text-[1.05rem] leading-relaxed">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="pl-1">{children}</li>,
    number: ({ children }) => <li className="pl-1">{children}</li>,
  },

  // ── Inline marks ────────────────────────────────────────────────────────────
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-gray-900 dark:text-gray-100">
        {children}
      </strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <u className="underline">{children}</u>,
    "strike-through": ({ children }) => (
      <s className="opacity-60">{children}</s>
    ),
    code: ({ children }) => (
      <code className="font-mono text-[0.875em] bg-gray-100 dark:bg-slate-800 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded">
        {children}
      </code>
    ),
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.openInNewTab ? "_blank" : "_self"}
        rel={value?.openInNewTab ? "noopener noreferrer" : undefined}
        className="text-purple-600 dark:text-purple-400 underline underline-offset-2 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
      >
        {children}
      </a>
    ),
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function PortableTextRenderer({ body }: PortableTextRendererProps) {
  return (
    <div className="py-8">
      <PortableText value={body} components={components} />
    </div>
  );
}
