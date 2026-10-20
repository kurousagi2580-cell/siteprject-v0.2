import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { CharacterType } from "@/types/utils/character-type"

export type AggregatePageConfig = {
  slug: string
  title: string
  subtitle: string | null
  entity_type: "characters" | "countries" | "regions" | "affiliations"
  is_active: boolean
  sort_order: number
}

export type AggregateFilterConfig = {
  id: string
  page_slug: string
  field_key: string
  label: string
  sort_order: number
}

export type AggregateEntry = {
  id: string
  name: string
  short_name: string | null
  image_url: string | null
  slug: string
  href: string
  filter_values: Record<string, string[]>
}

export type AggregatePageData = {
  page: AggregatePageConfig
  filters: AggregateFilterConfig[]
  entries: AggregateEntry[]
}

type CharacterRow = {
  id: string
  name: string
  short_name: string | null
  image_url: string | null
  slug: string | null
  affiliation: { name: string | null } | null
}

type CountryRow = {
  id: string
  name: string
  short_name: string | null
  image_url: string | null
  slug: string | null
}

type RegionRow = {
  id: string
  name: string
  short_name: string | null
  image_url: string | null
  slug: string | null
  country: { name: string | null } | null
}

type AffiliationRow = {
  id: string
  name: string
  short_name: string | null
  icon_url: string | null
  slug: string | null
}

type WordsRow = {
  id: string
  keyword: string
  read_word: string | null
  image_url: string | null
  slug: string | null
  category: string | null
}

const filterKeysByEntity = {
  characters: ["affiliation"],
  countries: [],
  regions: ["country"],
  affiliations: [],
} as const

export async function getAggregatePageData(
  slug: string,
  characterType: CharacterType = "プレイアブル",
): Promise<AggregatePageData | null> {
  const supabase = createSupabaseServerClient()
  const { data: page, error: pageError } = await supabase
    .from("aggregate_pages")
    .select("slug, title, subtitle, entity_type, is_active, sort_order")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle()
    .returns<AggregatePageConfig>()

  if (pageError) {
    console.error("getAggregatePageData page error:", pageError)
    throw pageError
  }
  if (!page) return null

  const { data: filters, error: filtersError } = await supabase
    .from("aggregate_filters")
    .select("id, page_slug, field_key, label, sort_order")
    .eq("page_slug", page.slug)
    .order("sort_order", { ascending: true })
    .returns<AggregateFilterConfig[]>()

  if (filtersError) {
    console.error("getAggregatePageData filters error:", filtersError)
    throw filtersError
  }

  const supportedKeys = filterKeysByEntity[page.entity_type]
  for (const filter of filters) {
    if (!(supportedKeys as readonly string[]).includes(filter.field_key)) {
      throw new Error(
        `Unsupported aggregate filter "${filter.field_key}" for "${page.entity_type}"`,
      )
    }
  }

  if (page.entity_type === "characters") {
    const { data, error } = await supabase
      .from("characters")
      .select(`
        id,
        name,
        short_name,
        image_url,
        slug,
        affiliation:affiliation (name)
      `)
      .eq("type", characterType)
      .order("name", { ascending: true })
      .returns<CharacterRow[]>()

    if (error) {
      console.error("getAggregatePageData characters error:", error)
      throw error
    }

    return {
      page,
      filters,
      entries: data.flatMap((character) => {
        if (!character.slug) return []
        return [{
          id: character.id,
          name: character.name,
          short_name: character.short_name,
          image_url: character.image_url,
          slug: character.slug,
          href: `/characters/${character.slug}`,
          filter_values: {
            affiliation: character.affiliation?.name ? [character.affiliation.name] : [],
          },
        }]
      }),
    }
  }

  if (page.entity_type === "countries") {
    const { data, error } = await supabase
      .from("countries")
      .select("id, name, short_name, image_url, slug")
      .order("name", { ascending: true })
      .returns<CountryRow[]>()

    if (error) {
      console.error("getAggregatePageData countries error:", error)
      throw error
    }

    return {
      page,
      filters,
      entries: data.flatMap((country) => {
        if (!country.slug) return []
        return [{
          id: country.id,
          name: country.name,
          short_name: country.short_name,
          image_url: country.image_url,
          slug: country.slug,
          href: `/countries/${country.slug}`,
          filter_values: {},
        }]
      }),
    }
  }

  if (page.entity_type === "affiliations") {
    const { data, error } = await supabase
      .from("affiliation")
      .select("id, name, short_name, icon_url, slug")
      .order("order", { ascending: true, nullsFirst: false })
      .order("name", { ascending: true })
      .returns<AffiliationRow[]>()

    if (error) {
      console.error("getAggregatePageData affiliations error:", error)
      throw error
    }

    return {
      page,
      filters,
      entries: data.flatMap((affiliation) => {
        if (!affiliation.slug) return []
        return [{
          id: affiliation.id,
          name: affiliation.name,
          short_name: affiliation.short_name,
          image_url: affiliation.icon_url,
          slug: affiliation.slug,
          href: `/affiliations/${affiliation.slug}`,
          filter_values: {},
        }]
      }),
    }
  }

  if (page.entity_type === "regions") {
    const { data, error } = await supabase
      .from("regions")
      .select("id, name, short_name, image_url, slug, country:countries!regions_parent_id_fkey (name)")
      .order("order", { ascending: true, nullsFirst: false })
      .order("name", { ascending: true })
      .returns<RegionRow[]>()

    if (error) {
      console.error("getAggregatePageData regions error:", error)
      throw error
    }

    return {
      page,
      filters,
      entries: data.flatMap((region) => {
        if (!region.slug) return []
        return [{
          id: region.id,
          name: region.name,
          short_name: region.short_name,
          image_url: region.image_url,
          slug: region.slug,
          href: `/regions/${region.slug}`,
          filter_values: {
          country: region.country?.name ? [region.country.name] : [],
        },
        }]
      }),
    }
  }

  const { data, error } = await supabase
    .from("words")
    .select(`
      id,
      keyword,
      read_word,
      image_url,
      slug,
      category
    `)
    .order("keyword", { ascending: true })
    .returns<WordsRow[]>()

  if (error) {
    console.error("getAggregatePageData words error:", error)
    throw error
  }

  return {
    page,
    filters,
    entries: data.flatMap((word) => {
      if (!word.slug) return []
      return [{
        id: word.id,
        name: word.keyword,
        short_name: word.read_word,
        image_url: word.image_url,
        slug: word.slug,
        href: `/words/${word.slug}`,
        filter_values: {},
      }]
    }),
  }
}
