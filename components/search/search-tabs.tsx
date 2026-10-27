// components/search/search-tabs.tsx
"use client";

import { CardPanel } from "@/components/ui/card-panel";
import { useRouter, useSearchParams } from "next/navigation";
import { isSearchTabKey, type SearchTabKey } from "@/types/utils/tab";

type SearchTabsProps = {
  tab: SearchTabKey;
  setTab: (tab: string) => void;
  goToPage: (page: number) => void;
};

export function SearchTabs({ tab, setTab, goToPage }: SearchTabsProps) {
  const tabs: string[] = ["all", "characters", "affiliations", "countries", "regions", "events", "words"];
  const router = useRouter();
  const params = useSearchParams();

  function handleClick(cat: string) {
    // update local state immediately for snappy UI
    setTab(cat);
    goToPage(1);

    // build new query params based on current ones
    const q = new URLSearchParams(Array.from(params.entries()));
    if (cat === "all") q.delete("tab");
    else q.set("tab", cat);
    // reset page when switching tab
    q.delete("page");

    const query = q.toString();
    const newUrl = query ? `/search?${query}` : `/search`;

    // guard: avoid pushing same URL repeatedly
    try {
      const current = window.location.pathname + window.location.search;
      if (current === newUrl) return;
    } catch (e) {
      // SSR: window not available — ignore
    }

    router.push(newUrl);
  }

  return (
    <CardPanel className="flex flex-col gap-4">
      <div className="flex gap-2">
        {tabs.map((cat) => (
          <button
            key={cat}
            onClick={() => handleClick(cat)}
            className={`px-3 py-2 rounded text-sm hover:bg-ananta-accent/80 ${
              tab === cat ? "bg-ananta-accent text-black font-bold" : "bg-ananta-surface2 text-ananta-text"
            }`}
          >
            {cat === "all" && "ALL"}
            {cat === "characters" && "キャラクター"}
            {cat === "affiliations" && "所属"}
            {cat === "countries" && "国"}
            {cat === "regions" && "地域"}
            {cat === "events" && "イベント"}
            {cat === "words" && "用語"}
          </button>
        ))}
      </div>
    </CardPanel>
  );
}
