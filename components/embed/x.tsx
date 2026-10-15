"use client";

import { useEffect, useRef } from "react";
import { loadTwitterWidgetsOnce } from "./twitter-widgets";

export function XEmbed({
  tweetId,
  ratio = { w: 16, h: 9 },
}: {
  tweetId: string;
  ratio?: { w: number; h: number };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const padding = (ratio.h / ratio.w) * 100;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await loadTwitterWidgetsOnce();
        if (!cancelled) window.twttr?.widgets.load(ref.current);
      } catch (error) {
        console.error("Failed to load X embed widgets:", error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div ref={ref} style={{ width: "100%", maxWidth: "550px", position: "relative", paddingBottom: `${padding}%` }}>
      <blockquote className="twitter-tweet">
        <a href={`https://twitter.com/i/status/${tweetId}`}></a>
      </blockquote>
    </div>
  );
}
