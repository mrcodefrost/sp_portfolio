import { codeToHtml } from "shiki";
import type { ContentBlock, CodeBlockValue } from "../types";

export interface ProcessedCodeBlock extends CodeBlockValue {
  _highlightedHtml: string;
}

const SUPPORTED_LANGS = new Set([
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
]);

export async function preprocessCodeBlocks(
  body: ContentBlock[]
): Promise<ContentBlock[]> {
  return Promise.all(
    body.map(async (block): Promise<ContentBlock> => {
      if (block._type !== "codeBlock") return block;

      const cb = block as CodeBlockValue;
      const lang =
        cb.language && SUPPORTED_LANGS.has(cb.language)
          ? cb.language
          : "text";

      let html: string;
      try {
        html = await codeToHtml(cb.code, {
          lang,
          themes: { light: "github-light", dark: "github-dark" },
          defaultColor: false,
        });
      } catch {
        const escaped = cb.code
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        html = `<pre style="padding:1.25rem"><code>${escaped}</code></pre>`;
      }

      return { ...cb, _highlightedHtml: html } as ProcessedCodeBlock;
    })
  );
}
