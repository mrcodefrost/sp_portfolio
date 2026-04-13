import { defineField, defineType } from "sanity";

export const codeBlockSchema = defineType({
  name: "codeBlock",
  title: "Code Snippet",
  type: "object",
  fields: [
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: {
        list: [
          "typescript",
          "javascript",
          "tsx",
          "jsx",
          "python",
          "go",
          "rust",
          "java",
          "cpp",
          "c",
          "bash",
          "shell",
          "json",
          "yaml",
          "toml",
          "css",
          "html",
          "markdown",
          "sql",
          "dart",
          "text",
        ].map((l) => ({ title: l, value: l })),
      },
      initialValue: "typescript",
    }),
    defineField({
      name: "filename",
      title: "Filename (optional)",
      type: "string",
      description: "e.g. src/utils/format.ts",
    }),
    defineField({
      name: "code",
      title: "Code",
      type: "text",
      rows: 12,
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: "filename", subtitle: "language" },
    prepare({ title, subtitle }) {
      return {
        title: title || "Code Block",
        subtitle: subtitle ? `Language: ${subtitle}` : "",
      };
    },
  },
});

export const imageBlockSchema = defineType({
  name: "imageBlock",
  title: "Image",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt Text",
      type: "string",
      description: "Required for accessibility and SEO",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption (optional)",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "alt", media: "image" },
    prepare({ title, media }) {
      return { title: title || "Image", media };
    },
  },
});

export const youtubeBlockSchema = defineType({
  name: "youtubeBlock",
  title: "YouTube Video",
  type: "object",
  fields: [
    defineField({
      name: "url",
      title: "YouTube URL",
      type: "url",
      description: "e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption (optional)",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "caption", subtitle: "url" },
    prepare({ title, subtitle }) {
      return {
        title: title || "YouTube Video",
        subtitle: subtitle || "",
      };
    },
  },
});
