import type { Metadata } from "next"
import ArticlePage from "@/components/article/article-page"
import { getArticleBySlug } from "@/actions/articles-actions-server"
import { stripHtmlToPlainText } from "@/lib/utils/image-url"
import { isUUID } from "@/lib/utils/utils"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    return { title: "記事" }
  }

  const descriptionText = stripHtmlToPlainText(article.body ?? "") || `${article.title}の記事です。`
  const description = descriptionText.length > 120 ? `${descriptionText.slice(0, 117).trimEnd()}...` : descriptionText

  return {
    title: article.title,
    description,
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string}> }) {
  const { slug } = await params
  const raw = slug
  const mode = isUUID(raw) ? "id" : "slug"

  return <ArticlePage id={mode === "id" ? raw : undefined} slug={mode === "slug" ? raw : undefined} entitySlug={slug} entityType="articles"/>
}
