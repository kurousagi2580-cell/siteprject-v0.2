// components/search/search-tabs.tsx
"use client"

import { CardPanel } from "@/components/ui/card-panel"

type TabKey = "all" | "characters" | "affiliations" | "countries" | "regions" | "events"

type SearchTabsProps = {
  tab: TabKey
  setTab: (tab: TabKey) => void
  goToPage: (page: number) => void
}

export function SearchTabs({ tab, setTab, goToPage }:SearchTabsProps) {
  const tabs: TabKey[] = ["all", "characters", "affiliations", "countries", "regions", "events"]

  return (
    <CardPanel className="flex flex-col gap-4">
      <div className="flex gap-2">
        {tabs.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setTab(cat)
              goToPage(1)
            }}
            className={`px-3 py-2 rounded text-sm hover:bg-ananta-accent/80 ${
              tab === cat
                ? "bg-ananta-accent text-black font-bold"
                : "bg-ananta-surface2 text-ananta-text"
            }`}
          >
            {cat === "all" && "ALL"}
            {cat === "characters" && "キャラクター"}
            {cat === "affiliations" && "所属"}
            {cat === "countries" && "国"}
            {cat === "regions" && "地域"}
            {cat === "events" && "イベント"}
          </button>
        ))}
      </div>
    </CardPanel>
  )
}
