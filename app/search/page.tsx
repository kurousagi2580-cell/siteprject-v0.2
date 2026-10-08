"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"

import { SiteShell } from "@/components/site-shell"
import { Section } from "@/components/ui/section"
import { GameSectionTitle } from "@/components/ui/game-section-title"

import { SearchBar } from "@/components/search/search-bor"
import { SearchTabs } from "@/components/search/search-tabs"
import { SearchResults } from "@/components/search/search-results"

import { getCharacters } from "@/lib/supabase/get-characters"
import { getAffiliations } from "@/lib/supabase/get-affiliations"
import { getCountries } from "@/lib/supabase/get-countries"
import { getRegions } from "@/lib/supabase/get-regions"
import { getGameEvents } from "@/lib/supabase/get-events"

import { filterByKeyword } from "@/lib/search/search-filter"
import { Character } from "@/types/character"
import { Affiliation } from "@/types/affiliation"
import { Country } from "@/types/country"
import { Region } from "@/types/region"
import { GameEvent } from "@/types/gameevents"

export default function SearchPage() {
  const params = useSearchParams()
  const router = useRouter()

  const keyword = params.get("q")?.toLowerCase() ?? ""
  const [input, setInput] = useState(keyword)
  const [tab, setTab] = useState<"all" | "characters" | "affiliations" | "countries" | "regions" | "events">("all")

  const PAGE_SIZE = 20
  const page = Number(params.get("page") ?? 1)

  const goToPage = (p: number): void => {
    router.push(`/search?q=${keyword}&page=${p}`)
  }

  // ▼ DB データ
  const [dbCharacters, setDbCharacters] = useState<Character[]>([])
  const [dbAffiliations, setDbAffiliations] = useState<Affiliation[]>([])
  const [dbCountries, setDbCountries] = useState<Country[]>([])
  const [dbRegions, setDbRegions] = useState<Region[]>([])
  const [dbEvents, setDbEvents] = useState<GameEvent[]>([])

  // ▼ DB からロード
  useEffect(() => {
    async function load() {
      setDbCharacters(await getCharacters())
      setDbAffiliations(await getAffiliations())
      setDbCountries(await getCountries())
      setDbRegions(await getRegions())
      setDbEvents(await getGameEvents())
    }
    load()
  }, [])

  // ▼ フィルタリング
  const characterResults = filterByKeyword(dbCharacters, keyword, (c) => c.name)
  const affiliationResults = filterByKeyword(dbAffiliations, keyword, (a) => a.name)
  const countryResults = filterByKeyword(dbCountries, keyword, (c) => c.name)
  const regionResults = filterByKeyword(dbRegions, keyword, (r) => r.name)
  const eventResults = filterByKeyword(dbEvents, keyword, (e) => e.title)

  return (
    <SiteShell>

      {/* ▼ ページタイトル */}
      <Section id="search">
        <GameSectionTitle
          title="SEARCH"
          subtitle="キーワードで検索"
        />
      </Section>

      {/* ▼ 検索バー */}
      <Section id="search-bar">
        <SearchBar
          input={input}
          setInput={setInput}
          keyword={keyword}
          onSearch={() => router.push(`/search?q=${input}`)}
        />
      </Section>

      {/* ▼ タブ */}
      <Section id="search-tabs">
        <SearchTabs
          tab={tab}
          setTab={setTab}
          goToPage={goToPage}
        />
      </Section>

      {/* ▼ 結果表示（ALL / CATEGORY 共通） */}
      <Section id="search-results">
        <SearchResults
          tab={tab}
          page={page}
          PAGE_SIZE={PAGE_SIZE}
          keyword={keyword}
          goToPage={goToPage}
          characterResults={characterResults}
          affiliationResults={affiliationResults}
          countryResults={countryResults}
          regionResults={regionResults}
          eventResults={eventResults}
        />
      </Section>

    </SiteShell>
  )
}
