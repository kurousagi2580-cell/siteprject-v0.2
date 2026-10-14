// markdown/headings.ts
import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import type { Parent } from "unist";
import { slugify } from "./utils/slugify";

export type HeadingItem = { id: string; text: string; level: number };

export async function extractHeadings(markdown: string): Promise<HeadingItem[]> {
  const tree = unified().use(remarkParse).parse(markdown) as Parent;
  const headings: HeadingItem[] = [];

  visit(tree, "heading", (node: any) => {
    const textParts: string[] = [];
    visit(node, (child: any) => {
      if (child.type === "text" || typeof child.value === "string") {
        textParts.push(String(child.value ?? ""));
      }
    });
    const text = textParts.join("").trim();
    if (!text) return;
    headings.push({
      id: slugify(text),
      text,
      level: node.depth
    });
  });

  return headings;
}
