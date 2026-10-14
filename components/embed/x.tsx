"use client";

import { useEffect, useRef } from "react";

let widgetsLoadingPromise: Promise<void> | null = null;
function loadTwitterWidgetsOnce(): Promise<void> {
  if ((window as any).twttr && (window as any).twttr.widgets) return Promise.resolve();
  if (widgetsLoadingPromise) return widgetsLoadingPromise;
  widgetsLoadingPromise = new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://platform.twitter.com/widgets.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => resolve();
    document.body.appendChild(s);
  });
  return widgetsLoadingPromise;
}

export function XEmbed({
  tweetUrl,
  ratio = { w: 16, h: 9 },
}: {
  tweetUrl: string;
  ratio?: { w: number; h: number };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const padding = (ratio.h / ratio.w) * 100;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadTwitterWidgetsOnce();
      if (cancelled) return;
      try {
        if ((window as any).twttr && (window as any).twttr.widgets && typeof (window as any).twttr.widgets.load === "function") {
          (window as any).twttr.widgets.load(ref.current);
        }
      } catch {
        // ignore
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div ref={ref} style={{ width: "100%", maxWidth: "550px", position: "relative", paddingBottom: `${padding}%` }}>
      <blockquote className="twitter-tweet">
        <a href={tweetUrl}></a>
      </blockquote>
    </div>
  );
}
