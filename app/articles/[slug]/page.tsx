import ArticlePage from "@/components/article/article-page"
import { isUUID } from "@/lib/utils/utils"

export default async function Page({ params }: { params: Promise<{ slug: string}> }) {
  const { slug } = await params
  const raw = slug
  const mode = isUUID(raw) ? "id" : "slug"

  return <ArticlePage id={mode === "id" ? raw : undefined} slug={mode === "slug" ? raw : undefined} entitySlug={slug} entityType="articles"/>
}
