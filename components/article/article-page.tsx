import { SiteShell } from "@/components/site-shell"
import { Surface } from "@/components/ui/surface"
import ArticleBody from "@/components/article/article-body"
import { extractHeadings } from "@/lib/article/markdown"
import type { Article } from "@/types/article"
import { fetchData } from "@/lib/supabase/queries"
import { buildEntityUrl } from "@/lib/utils/url-utils"

type Props = {
  id?: string
  slug?: string
  entitySlug?: string
  entityType?: string
}

export default async function ArticlePage({ id, slug, entitySlug, entityType}: Props) {

  let article: Article | null = null
  // ▼▼▼ id で取得
  if (id) {
    article = await fetchData<Article>("articles", {
      select: `*`,
      filters: [{ column: "id", operator: "eq", value: id }],
      single: true,
    })
  }

  // ▼▼▼ slug で取得
  else if (slug) {
    article = await fetchData<Article>("articles", {
      select: `*`,
      filters: [{ column: "slug", operator: "eq", value: slug }],
      single: true,
    })
  }
  else {
    return <p className="px-6 py-10">記事が見つかりません</p>
  }

  if (!article) {
    return <p className="px-6 py-10">記事が見つかりません</p>
  }

  const pageNavItems = extractHeadings(article.body ?? "")

  return (
    <SiteShell pageNavItems={pageNavItems} headerOffset={80}>
      <Surface
        variant="raised"
        className="
          bg-ananta-surface/40 backdrop-blur-xl
          border border-ananta-border/40
          shadow-[inset_0_0_20px_rgba(0,0,0,0.45)]
          rounded-xl
          p-6 md:p-8
          flex flex-col gap-6
        "
      >
        {/* タイトル */}
        <header className="flex flex-col gap-2">
          <span className="text-xs font-medium text-ananta-muted tracking-wide uppercase">
            {article.category}
          </span>

          <h1 className="text-2xl font-bold text-ananta-text">
            {article.title}
          </h1>

          <div className="flex items-center justify-between text-xs text-ananta-muted">
            <span>更新日 {article.updated_at?.slice(0, 10)}</span>

            {article.slug && article.title && (
              <a href={buildEntityUrl(entityType ?? "", entitySlug ?? "", article.slug ?? "")} className="underline">
                ← {article.title} に戻る
              </a>
            )}
          </div>
        </header>

        <hr className="border-ananta-border/500" />

        {/* アイキャッチ */}
        {article.eyecatch && <div className="mb-4">{article.eyecatch}</div>}

        {/* 本文 */}
        <div className="prose prose-invert max-w-none">
          <ArticleBody body={article.body ?? ""} />
        </div>

        <hr className="border-ananta-border/500" />

        {/* 関連リンク */}
        {/* 
        {article.r && (
          <section>
            <GameSectionTitle title="RELATED ARTICLES" subtitle="関連リンク" />

            <ul className="mt-2 flex flex-col gap-2 text-sm">
              {article.related.map((a: any) => (
                <li key={a.id}>
                  <a href={`/articles/${a.id}`} className="underline">
                    ・{a.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
          */}
      </Surface>
    </SiteShell>
  )
}
