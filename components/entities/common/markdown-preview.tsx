"use client";

import React from "react";
import { marked } from "marked";
import DOMPurifyType from "dompurify";
import { YouTubeEmbed } from "@/components/embed/youtube";
import { XEmbed } from "@/components/embed/x";

export function MarkdownPreview({ source }: { source: string }) {
  const lines = React.useMemo(() => String(source || "").split(/\r?\n/), [source]);
  const [sanitizedHtml, setSanitizedHtml] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      // DOMPurify の import は環境依存なのでファクトリかインスタンスか判定する
      let DOMPurify: typeof DOMPurifyType | null = null;
      try {
        const mod = await import("dompurify");
        if (typeof (mod as any).default === "function") {
          // mod.default is createDOMPurify
          // @ts-ignore
          DOMPurify = (mod as any).default(window) as typeof DOMPurifyType;
        } else {
          // mod itself is usable
          // @ts-ignore
          DOMPurify = (mod as any) as typeof DOMPurifyType;
        }
      } catch {
        DOMPurify = null;
      }

      const out: string[] = [];
      for (const line of lines) {
        const trimmed = line.trim();
        const yt = trimmed.match(/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/i);
        const x = trimmed.match(/^(?:https?:\/\/)?(?:www\.)?(?:x\.com|twitter\.com)\/[^\/]+\/status\/(\d+)/i);

        if (yt) {
          // Directly render placeholder div for consistency with ArticleEmbeds OR
          // you can render the component directly below (we render component directly)
          out.push(`<!--__EMBED_YT__:${yt[1]}-->`);
          continue;
        }
        if (x) {
          out.push(`<!--__EMBED_X__:${trimmed}-->`);
          continue;
        }

        // normal line -> inline markdown -> sanitize
        const raw = await marked.parseInline(line || "");
        if (DOMPurify && typeof DOMPurify.sanitize === "function") {
          out.push(DOMPurify.sanitize(raw));
        } else {
          // fallback escape
          const escaped = String(raw).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          out.push(escaped);
        }
      }

      if (!cancelled) setSanitizedHtml(out.join("\n"));
    })();

    return () => {
      cancelled = true;
    };
  }, [lines]);

  // while building, show loading
  if (sanitizedHtml === null) return <div>読み込み中…</div>;

  // Post-process the sanitizedHtml to replace our simple placeholders with actual React nodes.
  // We split by lines and map to either component or sanitized HTML.
  const parts = sanitizedHtml.split(/\n/).map((line, i) => {
    const ytMatch = line.match(/^<!--__EMBED_YT__:(.+)-->$/);
    if (ytMatch) {
      const videoId = ytMatch[1];
      return <div key={`yt-${i}`}><YouTubeEmbed videoId={videoId} /></div>;
    }
    const xMatch = line.match(/^<!--__EMBED_X__:(.+)-->$/);
    if (xMatch) {
      const tweetUrl = xMatch[1];
      return <div key={`x-${i}`}><XEmbed tweetUrl={tweetUrl} /></div>;
    }
    return <div key={`html-${i}`} dangerouslySetInnerHTML={{ __html: line }} />;
  });

  return <div className="prose max-w-none space-y-2">{parts}</div>;
}
