import type { MetadataRoute } from "next"
import { makeCrudActions } from "@/actions/make-crud-actions"
import { getSiteUrl } from "@/lib/utils/image-url"

async function fetchRows<T extends { slug?: string | null; created_at?: string | null; updated_at?: string | null }>(table: string, filterKey = "slug") {
  const actions = makeCrudActions<T>(table, filterKey)
  const { items } = await actions.list({
    page: 1,
    pageSize: 1000,
    noPagination: true,
    includeCount: false,
    sort: "created_at",
    order: "desc",
  })

  return items
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()

  const [characters, countries, regions, affiliations, articles, words] = await Promise.all([
    fetchRows<{ slug?: string | null; created_at?: string | null; updated_at?: string | null }>("characters"),
    fetchRows<{ slug?: string | null; created_at?: string | null; updated_at?: string | null }>("countries"),
    fetchRows<{ slug?: string | null; created_at?: string | null; updated_at?: string | null }>("regions"),
    fetchRows<{ slug?: string | null; created_at?: string | null; updated_at?: string | null }>("affiliation"),
    fetchRows<{ slug?: string | null; created_at?: string | null; updated_at?: string | null }>("articles"),
    fetchRows<{ slug?: string | null; created_at?: string | null; updated_at?: string | null }>("words"),
  ])

  const staticEntries = [
    { url: siteUrl, lastModified: new Date() },
    { url: `${siteUrl}/characters`, lastModified: new Date() },
    { url: `${siteUrl}/countries`, lastModified: new Date() },
    { url: `${siteUrl}/regions`, lastModified: new Date() },
    { url: `${siteUrl}/events`, lastModified: new Date() },
    { url: `${siteUrl}/updates`, lastModified: new Date() },
    { url: `${siteUrl}/relationgraph`, lastModified: new Date() },
    { url: `${siteUrl}/search`, lastModified: new Date() },
  ]

  const dynamicEntries = [
    ...characters
      .filter((item) => item.slug)
      .map((item) => ({ url: `${siteUrl}/characters/${item.slug}`, lastModified: item.updated_at ?? item.created_at ? new Date(item.updated_at ?? item.created_at ?? new Date().toISOString()) : new Date() })),
    ...countries
      .filter((item) => item.slug)
      .map((item) => ({ url: `${siteUrl}/countries/${item.slug}`, lastModified: item.updated_at ?? item.created_at ? new Date(item.updated_at ?? item.created_at ?? new Date().toISOString()) : new Date() })),
    ...regions
      .filter((item) => item.slug)
      .map((item) => ({ url: `${siteUrl}/regions/${item.slug}`, lastModified: item.updated_at ?? item.created_at ? new Date(item.updated_at ?? item.created_at ?? new Date().toISOString()) : new Date() })),
    ...affiliations
      .filter((item) => item.slug)
      .map((item) => ({ url: `${siteUrl}/affiliations/${item.slug}`, lastModified: item.updated_at ?? item.created_at ? new Date(item.updated_at ?? item.created_at ?? new Date().toISOString()) : new Date() })),
    ...articles
      .filter((item) => item.slug)
      .map((item) => ({ url: `${siteUrl}/articles/${item.slug}`, lastModified: item.updated_at ?? item.created_at ? new Date(item.updated_at ?? item.created_at ?? new Date().toISOString()) : new Date() })),
    ...words
      .filter((item) => item.slug)
      .map((item) => ({ url: `${siteUrl}/words/${item.slug}`, lastModified: item.updated_at ?? item.created_at ? new Date(item.updated_at ?? item.created_at ?? new Date().toISOString()) : new Date() })),
  ]

  return [...staticEntries, ...dynamicEntries]
}
