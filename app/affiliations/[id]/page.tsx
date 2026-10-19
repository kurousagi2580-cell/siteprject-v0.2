import { notFound } from "next/navigation"
import { AggregateList } from "@/components/aggregate/aggregate-list"
import { SiteShell } from "@/components/layout/site-shell"
import { getAffiliationWithCharacters } from "@/lib/supabase/queries/affiliations"

export const dynamic = "force-dynamic"

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
