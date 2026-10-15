"use client"

type PaginationProps = {
  page: number
  total: number
  PAGE_SIZE: number
  keyword: string
  goToPage: (p: number) => void
}

export function Pagination({
  page,
  total,
  PAGE_SIZE,
  keyword,
  goToPage,
}: PaginationProps) {
  const totalPage = Math.ceil(total / PAGE_SIZE)
  if (totalPage <= 1) return null

  return (
    <div className="flex justify-center items-center gap-3 mt-4">
      {page > 1 && (
        <button
          onClick={() => goToPage(page - 1)}
          className="px-3 py-2 bg-ananta-surface2 rounded hover:bg-ananta-surface"
        >
          前へ
        </button>
      )}

      <span className="px-3 py-2 text-sm text-ananta-muted">
        {page} / {totalPage}
      </span>

      {page < totalPage && (
        <button
          onClick={() => goToPage(page + 1)}
          className="px-3 py-2 bg-ananta-surface2 rounded hover:bg-ananta-surface"
        >
          次へ
        </button>
      )}
    </div>
  )
}
