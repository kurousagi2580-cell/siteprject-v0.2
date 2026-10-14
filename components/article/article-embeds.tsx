// components/article/article-embeds.tsx
"use client";
import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { YouTubeEmbed } from "@/components/embed/youtube";
import { XEmbed } from "@/components/embed/x";

function loadTwitterWidgetsOnce(): Promise<void> {
  return new Promise((resolve) => {
    if ((window as any).twttr && (window as any).twttr.widgets) return resolve();
    if ((window as any).__twitter_widgets_loading) {
      const i = setInterval(() => { if ((window as any).twttr && (window as any).twttr.widgets) { clearInterval(i); resolve(); } }, 200);
      return;
    }
    (window as any).__twitter_widgets_loading = true;
    const s = document.createElement("script");
    s.src = "https://platform.twitter.com/widgets.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => resolve();
    document.body.appendChild(s);
  });
}

export default function ArticleEmbeds() {
  const mounted = useRef(new Set<Element>());

  useEffect(() => {
    let cancelled = false;
    async function mountAll() {
      const ytEls = Array.from(document.querySelectorAll<HTMLDivElement>(".embed-youtube"));
      const xEls = Array.from(document.querySelectorAll<HTMLDivElement>(".embed-x"));

      ytEls.forEach(el => {
        if (mounted.current.has(el)) return;
        const id = el.getAttribute("data-video-id");
        if (!id) return;
        try { createRoot(el).render(<YouTubeEmbed videoId={id} />); }
        catch { el.innerHTML = `<div style="position:relative;padding-bottom:56.25%;height:0;"><iframe src="https://www.youtube.com/embed/${encodeURIComponent(id)}" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allowfullscreen loading="lazy"></iframe></div>`; }
        mounted.current.add(el);
      });

      if (xEls.length === 0) return;
      await loadTwitterWidgetsOnce();
      if (cancelled) return;

      xEls.forEach(el => {
        if (mounted.current.has(el)) return;
        const tweetUrl = el.getAttribute("data-tweet-url") || el.getAttribute("data-tweet-id");
        if (!tweetUrl) return;
        try { createRoot(el).render(<XEmbed tweetUrl={tweetUrl} />); }
        catch { el.innerHTML = `<a href="${encodeURI(tweetUrl)}" target="_blank" rel="noopener noreferrer">${tweetUrl}</a>`; }
        mounted.current.add(el);
      });

      try {
        if ((window as any).twttr && (window as any).twttr.widgets && typeof (window as any).twttr.widgets.load === "function") {
          xEls.forEach(el => { try { (window as any).twttr.widgets.load(el); } catch {} });
        }
      } catch {}
    }

    mountAll();
    return () => { cancelled = true; };
  }, []);

  return null;
}
