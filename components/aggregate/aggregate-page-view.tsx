import { notFound } from "next/navigation"
import { SiteShell } from "@/components/layout/site-shell"
import { AggregateList } from "@/components/aggregate/aggregate-list"
import { getAggregatePageData } from "@/lib/supabase/queries/aggregate"
import type { CharacterType } from "@/types/utils/character-type"

const characterCategories: Record<string, CharacterType> = {
  npc: "NPC",
  investigating: "調査中",
}

export async function AggregatePageView({
  slug,
  category,
}: {
  slug: string
  category?: string
}) {
  let characterType: CharacterType = "プレイアブル"
  let categoryLabel = "プレイアブル"

  if (slug === "characters" && category) {
    const selectedCategory = characterCategories[category]
    if (!selectedCategory) notFound()
    characterType = selectedCategory
    categoryLabel = selectedCategory
  } else if (category) {
    notFound()
  }

  const aggregate = await getAggregatePageData(slug, characterType)
  if (!aggregate) notFound()

  const subtitle =
    aggregate.page.entity_type === "characters"
      ? `${aggregate.page.subtitle ?? ""}・${categoryLabel}`
      : aggregate.page.subtitle

  return (
    <SiteShell showSidebar>
      <AggregateList
        title={aggregate.page.title}
        subtitle={subtitle}
        entries={aggregate.entries}
        filters={aggregate.filters}
      />
    </SiteShell>
  )
}
