// markdown/schema.ts
import { defaultSchema } from "hast-util-sanitize";
import type { Schema } from "hast-util-sanitize";

const schema: Schema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames || []),
    "h1", "h2", "h3", "h4", "h5", "h6",
    "figure", "figcaption", "details", "summary",
    "table", "thead", "tbody", "tfoot", "tr", "th", "td",
    "pre", "code", "kbd", "samp", "var",
    "img", "picture", "source",
    "blockquote", "hr"
  ],
  attributes: {
    // schema.attributes の "*": [...]
    "*": ["className", "id", "title", "aria-hidden", "role", "data-video-id", "data-tweet-id"]
    ,
    a: ["href", "title", "rel", "target"],
    img: ["src", "alt", "title", "width", "height", "loading"],
    source: ["srcset", "type", "media"],
    table: ["summary"],
    th: ["scope"]
  },
  protocols: {
    href: ["http", "https", "mailto", "tel"],
    src: ["http", "https"],
    cite: ["http", "https"]
  }
};

export default schema;
