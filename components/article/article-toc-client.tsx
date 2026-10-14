// components/article/article-toc-client.tsx
"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/types/articles/heading";

export default function ArticleTocClient({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!headings || headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { root: null, rootMargin: "0px 0px -60% 0px", threshold: [0, 0.1, 0.5, 1] }
    );

    headings.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  return (
    <div className="article-toc-client">
      <ul>
        {headings.map(h => (
          <li key={h.id} className={h.id === activeId ? "active" : ""}>
            <a href={`#${h.id}`}>{h.text}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
