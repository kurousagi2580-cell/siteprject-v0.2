import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { AggregateList } from "@/components/aggregate/aggregate-list"
import { SiteShell } from "@/components/layout/site-shell"
import { getAffiliationWithCharacters } from "@/lib/supabase/queries/affiliations"
import { stripHtmlToPlainText } from "@/lib/utils/image-url"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const result = await getAffiliationWithCharacters(id)

  if (!result) {
    return { title: "所属" }
  }

  const descriptionText = stripHtmlToPlainText(result.affiliation.description ?? "")
  const description = descriptionText.length > 120 ? `${descriptionText.slice(0, 117).trimEnd()}...` : descriptionText

  return {
    title: result.affiliation.name,
    description,
  }
}

export default async function AffiliationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: slug } = await params
  const result = await getAffiliationWithCharacters(slug)

  if (!result) notFound()

  const { affiliation, characters } = result

  return (
    <SiteShell>
      <AggregateList
        title={affiliation.name}
        subtitle={affiliation.description ?? affiliation.category}
        entries={characters.flatMap((character) => {
          if (!character.slug) return []
          return [{
            id: character.id,
            name: character.name,
            short_name: character.short_name,
            image_url: character.image_url,
            slug: character.slug,
            href: `/characters/${character.slug}`,
            filter_values: {},
          }]
        })}
        filters={[]}
      />
    </SiteShell>
  )
}
