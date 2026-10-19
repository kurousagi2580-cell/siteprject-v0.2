// markdown/render.ts
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import schema from "./schema";
import rehypeEmbed from "./rehype-embed";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { rehypeMarkdownStyles, remarkEnhancements } from "./remark-enhancements";

/**
 * Markdown をサニタイズ済み HTML に変換する。段落内の改行は br として出力する。
 * allowDangerousHtml: false により raw HTML は無効化される
 */
export async function renderMarkdownToHtml(markdown: string) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkBreaks)
    .use(remarkEnhancements)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeEmbed)
    .use(rehypeSanitize, schema)
    .use(rehypeSlug)
    .use(rehypeMarkdownStyles)
    .use(rehypeStringify)
    .process(markdown);

  return String(file);
}
