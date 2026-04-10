import type { ContentBlock, TOCItem } from "../types";
import type { PortableTextBlock, PortableTextSpan } from "@portabletext/types";

const HEADING_STYLES = new Set(["h2", "h3", "h4"]);

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function extractTOC(body: ContentBlock[]): TOCItem[] {
  return body
    .filter(
      (b): b is PortableTextBlock =>
        b._type === "block" &&
        HEADING_STYLES.has((b as PortableTextBlock).style as string)
    )
    .map((b) => {
      const text = (b.children as PortableTextSpan[])
        .filter((child) => child._type === "span")
        .map((child) => child.text)
        .join("");
      const level = parseInt(
        ((b.style as string) ?? "h2").replace("h", ""),
        10
      );
      return { id: slugifyHeading(text), text, level };
    })
    .filter((item) => item.text.length > 0);
}
