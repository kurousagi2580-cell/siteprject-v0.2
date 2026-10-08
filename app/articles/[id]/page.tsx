import ArticlePage from "@/components/article/article-page"
import { isUUID } from "@/lib/utils/utils"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const raw = id
  const mode = isUUID(raw) ? "id" : "slug"

  return <ArticlePage id={mode === "id" ? raw : undefined} slug={mode === "slug" ? raw : undefined} />
}
