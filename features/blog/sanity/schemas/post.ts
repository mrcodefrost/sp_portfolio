import { defineField, defineType } from "sanity";

export const postSchema = defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle / Excerpt",
      type: "string",
      group: "content",
      validation: (r) => r.max(200),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      group: "content",
      initialValue: "Daksh Nauni",
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      group: "content",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
      group: "content",
      description: "Leave blank if the post has never been updated after publishing.",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          validation: (r) => r.required(),
        }),
      ],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "readTime",
      title: "Read Time (minutes)",
      type: "number",
      group: "content",
      description:
        "Estimated reading time in minutes. Leave blank to auto-compute from body word count.",
      validation: (r) => r.min(1).integer(),
    }),
    defineField({
      name: "body",
      title: "Content",
      type: "array",
      group: "content",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
              { title: "Code", value: "code" },
              { title: "Underline", value: "underline" },
              { title: "Strike", value: "strike-through" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (r) =>
                      r
                        .uri({
                          allowRelative: true,
                          scheme: ["http", "https", "mailto", "tel"],
                        })
                        .required(),
                  },
                  {
                    name: "openInNewTab",
                    type: "boolean",
                    title: "Open in new tab",
                    initialValue: false,
                  },
                ],
              },
            ],
          },
        },
        { type: "codeBlock" },
        { type: "imageBlock" },
        { type: "youtubeBlock" },
      ],
    }),
    defineField({
      name: "relatedPosts",
      title: "Related Posts",
      type: "array",
      group: "content",
      of: [{ type: "reference", to: [{ type: "post" }] }],
      validation: (r) => r.max(3),
      description:
        "Manually curated related posts (up to 3). Leave blank to auto-fill with latest posts.",
    }),
    // ── SEO ────────────────────────────────────────────────────────────────
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      group: "seo",
      description: "Overrides the post title in search results (max 70 chars)",
      validation: (r) => r.max(70),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
      group: "seo",
      description: "Used for meta description (max 160 chars)",
      validation: (r) => r.max(160),
    }),
    defineField({
      name: "ogImage",
      title: "OpenGraph Image",
      type: "image",
      group: "seo",
      description: "Shown when the post is shared on social media (1200×630)",
      options: { hotspot: true },
    }),
    defineField({
      name: "keywords",
      title: "Keywords",
      type: "array",
      group: "seo",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "Used by Bing, AI search, and site search. Separate from tags.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "publishedAt",
      media: "coverImage",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title ?? "Untitled Post",
        subtitle: subtitle
          ? new Date(subtitle).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "No date",
        media,
      };
    },
  },
});
