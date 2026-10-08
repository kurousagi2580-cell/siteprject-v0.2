"use client"

import { CardPanel } from "@/components/ui/card-panel"
import { Pagination } from "./pagenation"

type CategoryPanelProps<T> = {
  title: string
  results: T[]
  page: number
  PAGE_SIZE: number
  keyword: string
  goToPage: (p: number) => void
  renderItem: (item: T) => React.ReactNode
}

export function CategoryPanel<T>({
  title,
  results,
  page,
  PAGE_SIZE,
  keyword,
  goToPage,
  renderItem,
}: CategoryPanelProps<T>) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-bold text-ananta-text">{title}</p>

      <CardPanel className="flex flex-col gap-4">
        <p className="text-ananta-muted text-xs">{results.length} 件ヒット</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {results.length ? (
            results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map(renderItem)
          ) : (
            <p className="text-ananta-muted text-sm">該当なし</p>
          )}
        </div>

        <Pagination
          page={page}
          total={results.length}
          PAGE_SIZE={PAGE_SIZE}
          keyword={keyword}
          goToPage={goToPage}
        />
      </CardPanel>
    </div>
  )
}
