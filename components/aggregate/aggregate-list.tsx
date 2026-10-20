"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { AppImage } from "@/components/app-image"
import type { AggregateEntry, AggregateFilterConfig } from "@/lib/supabase/queries/aggregate"

export function AggregateList({
  title,
  subtitle,
  entries,
  filters,
}: {
  title: string
  subtitle: string | null
  entries: AggregateEntry[]
  filters: AggregateFilterConfig[]
}) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({})
  const filterOptions = useMemo(
    () =>
      Object.fromEntries(
        filters.map((filter) => [
          filter.field_key,
          Array.from(
            new Set(
              entries.flatMap((entry) => entry.filter_values[filter.field_key] ?? []),
            ),
          ).sort((a, b) => a.localeCompare(b, "ja")),
        ]),
      ),
    [entries, filters],
  )

  const filteredEntries = entries.filter((entry) =>
    filters.every((filter) => {
      const selectedValue = selectedFilters[filter.field_key]
      return (
        !selectedValue ||
        (entry.filter_values[filter.field_key] ?? []).includes(selectedValue)
      )
    }),
  )

  return (
    <>
      <section
        aria-labelledby="aggregate-title"
        className="mb-5 rounded-xl border border-ananta-border/70 bg-gradient-to-br from-ananta-surface2 to-ananta-surface p-4 shadow-lg shadow-black/10 sm:p-6"
      >
        <nav aria-label="パンくずリスト" className="mb-4 text-xs text-ananta-muted">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="text-ananta-muted no-underline hover:text-ananta-text">
                TOP
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="truncate text-ananta-text">
              {title}
            </li>
          </ol>
        </nav>

        <header className="mb-5 border-b border-ananta-border/50 pb-4">
          <h1 id="aggregate-title" className="text-2xl font-bold text-ananta-text sm:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm text-ananta-muted">
              {subtitle}
            </p>
          )}
        </header>

        {filters.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filters.map((filter) => (
              <label key={filter.id} className="flex min-w-0 items-center gap-3">
                <span className="w-20 shrink-0 text-sm text-ananta-muted">
                  {filter.label}
                </span>
                <select
                  value={selectedFilters[filter.field_key] ?? ""}
                  onChange={(event) =>
                    setSelectedFilters((current) => ({
                      ...current,
                      [filter.field_key]: event.target.value,
                    }))
                  }
                  className="h-10 min-w-0 flex-1 rounded-lg border border-ananta-border bg-ananta-surface2 px-3 text-sm text-ananta-text outline-none focus:border-ananta-accent"
                >
                  <option value="">すべて</option>
                  {(filterOptions[filter.field_key] ?? []).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        )}
      </section>

      <p className="mb-3 text-sm text-ananta-muted" aria-live="polite">
        {filteredEntries.length} 件
      </p>

      {filteredEntries.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
          {filteredEntries.map((entry) => (
            <Link
              key={entry.id}
              href={entry.href}
              className="group rounded-xl border border-ananta-border/70 bg-ananta-surface2/80 p-3 text-center no-underline transition hover:-translate-y-0.5 hover:border-ananta-accent/60 hover:bg-ananta-surface2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ananta-accent"
            >
              <div className="relative mx-auto aspect-square w-full max-w-36 overflow-hidden rounded-full border border-ananta-border bg-ananta-surface">
                <AppImage
                  src={entry.image_url || "/noimage.png"}
                  alt={entry.name}
                  fill
                  sizes="(max-width: 640px) 42vw, (max-width: 1280px) 22vw, 160px"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <p className="mt-3 break-words text-sm font-medium text-ananta-text">
                {entry.name}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-ananta-border/60 bg-ananta-surface/50 px-4 py-10 text-center text-sm text-ananta-muted">
          条件に一致する項目はありません。
        </p>
      )}
    </>
  )
}
