"use client"

import { Pagination } from "./pagenation"

type CategorySectionProps<T> = {
  title: string
  results: T[]
  page: number
  PAGE_SIZE: number
  keyword: string
  goToPage: (p: number) => void
  renderItem: (item: T) => React.ReactNode
}

export function CategorySection<T>({
  title,
  results,
  page,
  PAGE_SIZE,
  keyword,
  goToPage,
  renderItem,
}: CategorySectionProps<T>) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-bold text-ananta-text">
        {title}（{results.length}件）
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {results.length
          ? results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map(renderItem)
          : null}
      </div>

      <Pagination
        page={page}
        total={results.length}
        PAGE_SIZE={PAGE_SIZE}
        keyword={keyword}
        goToPage={goToPage}
      />
    </div>
  )
}
