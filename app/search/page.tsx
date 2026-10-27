// src/app/search/page.tsx
import { SiteShell } from "@/components/layout/site-shell";
import { Section } from "@/components/ui/section";
import { GameSectionTitle } from "@/components/ui/game-section-title";
import SearchPageClient from "@/components/search/search-page-client"
import { isSearchTabKey, type SearchTabKey } from "@/types/utils/tab";

import { getSearchResults } from "@/lib/search/get-search-results";

type Props = { searchParams?: Promise<{ q?: string; page?: string; tab?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  
  const q = (params?.q ?? "").toString();
  const rawTab = params?.tab;
  const tab: SearchTabKey = isSearchTabKey(rawTab) ? rawTab : "all";
  const page = Number(params?.page ?? "1");
  const res = await getSearchResults({ q, page, tab });

  const pageData = {
    characters: res.characters ?? [],
    affiliations: res.affiliations ?? [],
    countries: res.countries ?? [],
    regions: res.regions ?? [],
    events: res.events ?? [],
    words: res.words ?? [],
    totals: res.totals,
  };

  return (
    <SiteShell>
       <Section id="search">
        <GameSectionTitle title="SEARCH" subtitle="キーワードで検索" />
      </Section>

      <Section id="search-bar">
        {/* SearchPageClient は client component のまま使うが、dbデータではなく server で取得した結果を渡す */}
        <SearchPageClient
          initialQuery={q}
          initialPage={page}
          PAGE_SIZE={20}
          characterResults={pageData.characters}
          affiliationResults={pageData.affiliations}
          countryResults={pageData.countries}
          regionResults={pageData.regions}
          eventResults={pageData.events}
          wordResults={pageData.words}
        />
      </Section>
    </SiteShell>
  );
}
