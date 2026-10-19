import { AggregatePageView } from "@/components/aggregate/aggregate-page-view"

export const dynamic = "force-dynamic"

export default async function AggregatePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <AggregatePageView slug={slug} />
}
