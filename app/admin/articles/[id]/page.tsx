import { fetchData } from "@/lib/supabase/queries"
import ArticleForm from "@/components/admin/article-form"
import { Article } from "@/types/article"
import { getPages } from "@/lib/supabase/get-pages"

export default async function ArticleEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const pageData = await getPages() ?? []

  const article = await fetchData<Article>("articles", {
    select: "id, title, slug, eyecatch, body, category, created_at, updated_at",
    filters: [{ column: "id", operator: "eq", value: id }],
    single: true
  })

  if (!article) {
    return null
  }

  return <ArticleForm mode="edit" initialArticle={article} pageData={pageData} />
}
