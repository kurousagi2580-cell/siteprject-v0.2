// components/search/search-bar.tsx
"use client"

import { Button } from "@/components/ui/button"
import { CardPanel } from "@/components/ui/card-panel"

type SearchBarProps = {
  input: string
  setInput: (value: string) => void
  keyword: string
  onSearch: () => void
}

export function SearchBar({ input, setInput, keyword, onSearch }:SearchBarProps) {
  return (
    <CardPanel className="flex flex-col gap-4">
      <p className="text-sm font-bold text-ananta-text">検索</p>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="キーワード検索"
        className="rounded border border-ananta-border bg-ananta-surface2 px-3 py-2 text-sm text-ananta-text"
      />

      <Button
        variant="glass"
        onClick={onSearch}
        className="rounded bg-ananta-accent px-3 py-2 text-sm font-bold text-black hover:bg-ananta-accent/80"
      >
        検索
      </Button>

      <p className="text-ananta-muted text-xs">
        現在のキーワード: 「{keyword || "（未入力）"}」
      </p>
    </CardPanel>
  )
}
