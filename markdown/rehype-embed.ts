// markdown/rehype-embed.ts
import { visit } from "unist-util-visit";
import type { Root, Element } from "hast";

const YT_REGEX = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/i;
const X_REGEX = /^(?:https?:\/\/)?(?:www\.)?(?:x\.com|twitter\.com)\/[^\/\s]+\/status\/(\d+)/i;

/**
 * rehype plugin: paragraph 内の「行単位 URL」を検出して
 * <div class="embed-youtube" data-video-id="..."></div>
 * <div class="embed-x" data-tweet-id="..."></div>
 * に置き換える
 */
export default function rehypeEmbed() {
    return (tree: Root) => {
        visit(tree, "element", (node, index, parent) => {
            if (node.tagName !== "p") return;

            // p の中身が単一のテキストノードか a 要素のみかを判定
            const children = node.children ?? [];

            if (children.length === 0) return;

            // テキストのみ
            if (children.length === 1 && children[0].type === "text") {
                const text = String(children[0].value).trim();
                const cleaned = text
                    .replace(/[.,;:)\]]+$/g, "")
                    .replace(/^[\s\[(]+/g, "");

                const yt = cleaned.match(YT_REGEX);
                if (yt) {
                    const videoId = yt[1];
                    const el: Element = {
                        type: "element",
                        tagName: "div",
                        properties: { className: ["embed-youtube"], "data-video-id": videoId },
                        children: []
                    };
                    if (parent && typeof index === "number") parent.children.splice(index, 1, el);
                    return;
                }

                const x = cleaned.match(X_REGEX);
                if (x) {
                    const tweetId = x[1];
                    const el: Element = {
                        type: "element",
                        tagName: "div",
                        properties: { className: ["embed-x"], "data-tweet-id": tweetId, "data-tweet-url": cleaned },
                        children: []
                    };
                    if (parent && typeof index === "number") parent.children.splice(index, 1, el);
                    return;
                }
            }

            // a 要素のみ（<p><a href="...">...</a></p>）のケース
            if (children.length === 1 && children[0].type === "element" && (children[0] as Element).tagName === "a") {
                const a = children[0] as Element;
                const href = (a.properties && (a.properties as any).href) ? String((a.properties as any).href) : "";
                const cleaned = href
                    .replace(/[.,;:)\]]+$/g, "")
                    .replace(/^[\s\[(]+/g, "");
                const yt = cleaned.match(YT_REGEX);
                if (yt) {
                    const videoId = yt[1];
                    const el: Element = {
                        type: "element",
                        tagName: "div",
                        properties: { className: ["embed-youtube"], "data-video-id": videoId },
                        children: []
                    };
                    if (parent && typeof index === "number") parent.children.splice(index, 1, el);
                    return;
                }
                const x = cleaned.match(X_REGEX);
                if (x) {
                    const tweetId = x[1];
                    const el: Element = {
                        type: "element",
                        tagName: "div",
                        properties: { className: ["embed-x"], "data-tweet-id": tweetId, "data-tweet-url": cleaned },
                        children: []
                    };
                    if (parent && typeof index === "number") parent.children.splice(index, 1, el);
                    return;
                }
            }
        });
    };
}
