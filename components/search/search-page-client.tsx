// src/components/search/search-page-client.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import useTab from "@/hooks/use-tab";

import { SearchBar } from "@/components/search/search-bar";
import { SearchTabs } from "@/components/search/search-tabs";
import { isSearchTabKey, type SearchTabKey } from "@/types/utils/tab";
import { SearchResults } from "@/components/search/search-results";
import { filterByKeyword } from "@/lib/search/search-filter";

import useSearch from "@/hooks/use-search";
import usePagination from "@/hooks/use-pagination";
import type { Character } from "@/types/character";
import type { Affiliation } from "@/types/affiliation";
import type { Country } from "@/types/country";
import type { Region } from "@/types/region";
import type { GameEvent } from "@/types/gameevents";
import type { Word } from "@/types/word";

type Props = {
  initialTab?: SearchTabKey;
  initialQuery?: string;
  initialPage?: number;
  PAGE_SIZE: number;
  characterResults: any[];
  affiliationResults: any[];
  countryResults: any[];
  regionResults: any[];
  eventResults: any[];
  wordResults: any[];
};

export default function SearchPageClient({
  initialQuery = "",
  initialPage = 1,
  initialTab = "all",
  PAGE_SIZE,
  characterResults,
  affiliationResults,
  countryResults,
  regionResults,
  eventResults,
  wordResults,
}: Props) {
  // hooks に置き換え
  const { tab, setTab } = useTab(initialTab);
  const activeTab = isSearchTabKey(tab) ? tab : "all";
  const { q, onChange, debounced } = useSearch(initialQuery);
  const { page, goTo } = usePagination(initialPage);

  // 既存の SearchBar API を壊さないために input state を維持する場合
  const [input, setInput] = useState(q);
  useEffect(() => setInput(q), [q]);

  const keywordFromParams = debounced.toLowerCase();

  // 既存の filterByKeyword を使う場合は、server 側で絞り込んでいるなら不要
  // ここでは念のため client 側でもフィルタをかける（冗長だが互換性維持）
  const characterFiltered = useMemo(
    () => filterByKeyword(characterResults, keywordFromParams, (c) => c.name),
    [characterResults, keywordFromParams]
  );
  const affiliationFiltered = useMemo(
    () => filterByKeyword(affiliationResults, keywordFromParams, (a) => a.name),
    [affiliationResults, keywordFromParams]
  );
  const countryFiltered = useMemo(
    () => filterByKeyword(countryResults, keywordFromParams, (c) => c.name),
    [countryResults, keywordFromParams]
  );
  const regionFiltered = useMemo(
    () => filterByKeyword(regionResults, keywordFromParams, (r) => r.name),
    [regionResults, keywordFromParams]
  );
  const eventFiltered = useMemo(
    () => filterByKeyword(eventResults, keywordFromParams, (e) => e.title),
    [eventResults, keywordFromParams]
  );
  const wordFiltered = useMemo(
    () => filterByKeyword(wordResults, keywordFromParams, (w) => w.keyword ?? w.slug ?? ""),
    [wordResults, keywordFromParams]
  );

  const goToPage = (p: number) => goTo(p);

  return (
    <>
      <SearchBar
        input={input}
        setInput={setInput}
        keyword={keywordFromParams}
        onSearch={() => onChange(input)}
      />

      <SearchTabs tab={activeTab} setTab={(t) => setTab(t as SearchTabKey)} goToPage={(p)=>goTo(p)} />

      <SearchResults
        tab={activeTab}
        page={page}
        PAGE_SIZE={PAGE_SIZE}
        keyword={keywordFromParams}
        goToPage={goToPage}
        characterResults={characterFiltered}
        affiliationResults={affiliationFiltered}
        countryResults={countryFiltered}
        regionResults={regionFiltered}
        eventResults={eventFiltered}
        wordResults={wordFiltered}
      />
    </>
  );
}
