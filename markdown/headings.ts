// markdown/headings.ts
import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit} from "unist-util-visit";
import type { Parent } from "unist";
import GithubSlugger from "github-slugger"

export type HeadingItem = { id: string; text: string; level: number };

export function extractHeadings(markdown: string): HeadingItem[] {
  const tree = unified().use(remarkParse).parse(markdown) as Parent;
  const slugger = new GithubSlugger()
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
      id: slugger.slug(text),
      text,
      level: node.depth
    });
  });

  return headings;
}
