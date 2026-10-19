// components/article/article-embeds.tsx
"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { YouTubeEmbed } from "@/components/embed/youtube";
import { XEmbed } from "@/components/embed/x";

export default function ArticleEmbeds({ refreshKey }: { refreshKey?: number }) {
  const roots = useRef(new Map<Element, Root>());
  const pruneTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (pruneTimer.current) {
      clearTimeout(pruneTimer.current);
      pruneTimer.current = null;
    }

    const mount = (element: HTMLDivElement, component: ReactNode) => {
      if (roots.current.has(element)) return;
      try {
        const root = createRoot(element);
        roots.current.set(element, root);
        root.render(component);
      } catch (error) {
        console.error("Failed to mount article embed:", error);
      }
    };

    document.querySelectorAll<HTMLDivElement>(".embed-youtube").forEach((element) => {
      const videoId = element.getAttribute("data-video-id");
      if (videoId && /^[A-Za-z0-9_-]{11}$/.test(videoId)) {
        mount(element, <YouTubeEmbed videoId={videoId} />);
      }
    });

    document.querySelectorAll<HTMLDivElement>(".embed-x").forEach((element) => {
      const tweetId = element.getAttribute("data-tweet-id");
      if (tweetId && /^\d+$/.test(tweetId)) {
        mount(element, <XEmbed tweetId={tweetId} />);
      }
    });

    const pruneDetachedRoots = () => {
      pruneTimer.current = null;
      roots.current.forEach((root, element) => {
        if (element.isConnected) return;
        roots.current.delete(element);
        root.unmount();
      });
    };

    const schedulePrune = () => {
      if (pruneTimer.current) clearTimeout(pruneTimer.current);
      pruneTimer.current = setTimeout(pruneDetachedRoots, 0);
    };

    schedulePrune();

    return () => {
      schedulePrune();
    };
  }, [refreshKey]);

  return null;
}
