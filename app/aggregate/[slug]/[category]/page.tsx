import { AggregatePageView } from "@/components/aggregate/aggregate-page-view"

export const dynamic = "force-dynamic"

export default async function AggregateCategoryPage({
  params,
}: {
  params: Promise<{ slug: string; category: string }>
}) {
  const { slug, category } = await params
  return <AggregatePageView slug={slug} category={category} />
}
