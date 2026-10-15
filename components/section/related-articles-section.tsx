// components/section/related-articles-section.tsx
import { LinkCardBox } from "@/components/ui/link-card-box"
import { AppImage } from "@/components/app-image"
import { CardPanel } from "@/components/ui/card-panel"
import { GameSectionTitle } from "@/components/ui/game-section-title"
import { Section } from "@/components/ui/section"
import { buildEntityUrl } from "@/lib/utils/url-utils"
import type { Article } from "@/types/article"

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articles.map((a) => (
              <LinkCardBox
                key={a.id}
                href={buildEntityUrl(entityType, entitySlug, a.slug ?? "")}
                className="flex flex-col"
              >
                {/* アイキャッチ */}
                <div className="relative aspect-video w-full">
                  <AppImage
                    src={a.eyecatch || "/noimage.png"}
                    alt={a.title ?? ""}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover rounded-sm"
                  />
                </div>

                {/* タイトル */}
                <p className="font-bold text-ananta-text">{a.title}</p>

                {/* カテゴリ */}
                <p className="text-ananta-muted text-xs">
                  {a.category ?? "未分類"}
                </p>
              </LinkCardBox>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ananta-muted">関連記事なし</p>
        )}
      </CardPanel>
    </Section>
  )
}
