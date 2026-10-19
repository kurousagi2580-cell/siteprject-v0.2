// components/section/related-articles-section.tsx
import { FileText } from "lucide-react"
import { CardPanel } from "@/components/ui/card-panel"
import { GameSectionTitle } from "@/components/ui/game-section-title"
import { Section } from "@/components/ui/section"
import { buildEntityUrl } from "@/lib/utils/url-utils"
import type { Article } from "@/types/article"
import Link from "next/link"

export function RelatedArticlesSection({
  articles,
  entitySlug,
  entityType = ""
}: {
  articles: Article[]
  entitySlug: string
  entityType?: string
}) {
  return (
    <Section id="related-articles">
      <GameSectionTitle
        title="RELATED ARTICLES"
        subtitle="関連する記事一覧"
      />

      <CardPanel>
        {articles.length ? (
          <ul className="max-h-[196px] space-y-1 overflow-y-auto overscroll-contain text-sm">
            {articles.map((a) => (
              <li key={a.id}>
                <Link
                  href={buildEntityUrl(entityType, entitySlug, a.slug ?? "")}
                  className="group flex min-h-9 items-center gap-2 rounded-md px-2 py-2 text-ananta-text no-underline transition-colors hover:bg-ananta-surface2/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ananta-accent"
                >
                  <FileText
                    aria-hidden="true"
                    className="size-4 shrink-0 text-ananta-muted"
                  />
                  <span className="min-w-0 flex-1 truncate font-medium group-hover:text-ananta-accent">
                    {a.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-ananta-muted">関連記事なし</p>
        )}
      </CardPanel>
    </Section>
  )
}
