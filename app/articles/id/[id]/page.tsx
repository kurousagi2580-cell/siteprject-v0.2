import ArticlePage from "@/components/article/article-page"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <ArticlePage id={id} />
}
