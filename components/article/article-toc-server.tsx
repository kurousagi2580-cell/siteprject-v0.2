// components/article/article-toc-server.tsx
import type { Heading } from "@/types/articles/heading";

export default function ArticleTocServer({ headings }: { headings: Heading[] }) {
  return (
    <nav aria-label="目次" className="article-toc">
      <ul>
        {headings.map(h => (
          <li key={h.id} className={`toc-level-${h.level}`}>
            <a href={`#${h.id}`}>{h.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
