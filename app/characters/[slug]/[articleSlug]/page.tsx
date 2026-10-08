import ArticlePage from "@/components/article/article-page"
import { isUUID } from "@/lib/utils/utils"

export default async function Page({ params }: { params: Promise<{ slug: string; articleSlug: string }> }) {
  const { slug, articleSlug } = await params
  const raw = articleSlug
  const mode = isUUID(articleSlug) ? "id" : "slug"

  return <ArticlePage id={mode === "id" ? raw : undefined} slug={mode === "slug" ? raw : undefined} entitySlug={articleSlug} entityType="characters"/>
}
