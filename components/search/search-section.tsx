import { CardPanel } from "@/components/ui/card-panel"
import { GameSectionTitle } from "@/components/ui/game-section-title"
import { Button } from "@/components/ui/button"

type FilterOption = {
  value: string
  label: string
}

export function SearchSection({
  title,
  subtitle,
  keyword,
  onKeywordChange,
  filterLabel,
  filterValue,
  onFilterChange,
  filterOptions,
}: {
  title: string
  subtitle?: string
  keyword: string
  onKeywordChange: (v: string) => void
  filterLabel: string
  filterValue: string
  onFilterChange: (v: string) => void
  filterOptions: FilterOption[]
}) {
  return (
    <section className="mt-6 mb-4">
      {/* セクション内の項目に余白を付ける */}
      <div className="space-y-4">

        {/* 見出し */}
        <GameSectionTitle title={title} subtitle={subtitle} />

        {/* 検索UI */}
        <CardPanel className="flex flex-col gap-4">
          {/* キーワード検索 */}
          <input
            type="text"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder="キーワード検索"
            className="
              rounded border border-ananta-border
              bg-ananta-surface2 px-3 py-2
              text-sm text-ananta-text
            "
          />

          {/* フィルタ（所属 ｜ すべて を横並び） */}
          <div
            className="
    w-full
    flex items-center
    rounded border border-ananta-border
    bg-ananta-surface2

  "
          >
            {/* 左側ラベル（固定幅） */}
            <span className="text-sm text-ananta-text w-20 px-3">
              {filterLabel}
            </span>

            {/* 右側プルダウン（70%以上を占める） */}
            <select
              value={filterValue}
              onChange={(e) => onFilterChange(e.target.value)}
              className="
      flex-1
      min-w-[70%]
      bg-ananta-surface2
      text-sm text-ananta-text
      px-3 py-2
      rounded border border-ananta-border
    "
            >
              <option value="">すべて</option>
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* 検索ボタン */}
          <Button variant="glass" className="rounded bg-ananta-accent px-3 py-2 text-sm font-bold text-black hover:bg-ananta-accent/80">
            検索
          </Button>
        </CardPanel>

      </div>
    </section>
  )
}
