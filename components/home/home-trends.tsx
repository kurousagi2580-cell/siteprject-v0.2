"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { AppImage } from "@/components/app-image"
import type { AggregatePageData } from "@/lib/supabase/queries/aggregate"

const TREND_ENTRY_LIMIT = 4

export function HomeTrends({
  aggregatePages,
}: {
  aggregatePages: AggregatePageData[]
}) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const cardsRef = useRef<HTMLDivElement>(null)

  function selectGenre(index: number) {
    setSelectedIndex(index)
    const card = cardsRef.current?.querySelector<HTMLElement>(
      `[data-trend-index="${index}"]`,
    )
    card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })
  }

  return (
    <section
      aria-labelledby="home-trends-title"
      className="min-w-0 rounded-xl border border-ananta-border/70 bg-ananta-surface2/80 p-4 shadow-lg shadow-black/10 sm:p-5"
    >
      <header className="mb-4 border-b border-ananta-border/50 pb-3">
        <div className="flex items-center justify-between gap-3">
          <h2 id="home-trends-title" className="text-lg font-bold text-ananta-text">
            トレンド
          </h2>
          {aggregatePages.length > 0 && (
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                aria-label="前のジャンル"
                disabled={selectedIndex === 0}
                onClick={() => selectGenre(Math.max(0, selectedIndex - 1))}
                className="flex size-8 items-center justify-center rounded-full border border-ananta-border/60 text-ananta-muted transition hover:text-ananta-text disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft aria-hidden="true" className="size-4" />
              </button>
              <button
                type="button"
                aria-label="次のジャンル"
                disabled={selectedIndex === aggregatePages.length - 1}
                onClick={() =>
                  selectGenre(Math.min(aggregatePages.length - 1, selectedIndex + 1))
                }
                className="flex size-8 items-center justify-center rounded-full border border-ananta-border/60 text-ananta-muted transition hover:text-ananta-text disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowRight aria-hidden="true" className="size-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {aggregatePages.length > 0 ? (
        <>
          <nav
            aria-label="トレンドのジャンル"
            className="mb-4 flex min-w-0 gap-1 overflow-x-auto border-b border-ananta-border/50 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {aggregatePages.map(({ page }, index) => (
              <button
                key={page.slug}
                type="button"
                aria-pressed={selectedIndex === index}
                onClick={() => selectGenre(index)}
                className={`shrink-0 border-b-2 px-3 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-ananta-accent ${
                  selectedIndex === index
                    ? "border-ananta-accent text-ananta-accent"
                    : "border-transparent text-ananta-muted hover:text-ananta-text"
                }`}
              >
                {page.title}
              </button>
            ))}
          </nav>

          <div
            ref={cardsRef}
            className="flex min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {aggregatePages.map(({ page, entries }, index) => (
              <section
                key={page.slug}
                data-trend-index={index}
                aria-labelledby={`home-trend-${page.slug}`}
                className="min-w-0 flex-[0_0_100%] snap-start rounded-lg border border-ananta-border/60 bg-ananta-surface/60 p-3 sm:flex-[0_0_calc(50%_-_0.375rem)]"
              >
                <header className="mb-3 flex min-w-0 items-center justify-between gap-2">
                  <h3
                    id={`home-trend-${page.slug}`}
                    className="truncate text-sm font-semibold text-ananta-accent"
                  >
                    {page.title}
                  </h3>
                  <Link
                    href={`/aggregate/${encodeURIComponent(page.slug)}`}
                    className="inline-flex shrink-0 items-center gap-1 text-xs text-ananta-muted no-underline transition hover:text-ananta-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-ananta-accent"
                  >
                    もっと見る
                    <ArrowRight aria-hidden="true" className="size-3.5" />
                  </Link>
                </header>

                {entries.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {entries.slice(0, TREND_ENTRY_LIMIT).map((entry) => (
                      <Link
                        key={entry.id}
                        href={entry.href}
                        title={entry.name}
                        className="group min-w-0 rounded-lg border border-ananta-border/60 bg-ananta-surface2/70 p-1.5 text-center no-underline transition hover:border-ananta-accent/60 hover:bg-ananta-surface2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ananta-accent"
                      >
                        <div className="relative aspect-square overflow-hidden rounded-md bg-ananta-surface">
                          <AppImage
                            src={entry.image_url || "/noimage.png"}
                            alt={entry.name}
                            fill
                            sizes="(max-width: 640px) 40vw, (max-width: 1280px) 18vw, 140px"
                            className="object-cover transition duration-300 group-hover:scale-105"
                          />
                        </div>
                        <p className="mt-1.5 truncate text-xs text-ananta-text">
                          {entry.name}
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="py-6 text-center text-xs text-ananta-muted">
                    登録されている項目はありません。
                  </p>
                )}
              </section>
            ))}
          </div>
        </>
      ) : (
        <p className="rounded-lg border border-ananta-border/60 bg-ananta-surface/50 px-4 py-8 text-center text-sm text-ananta-muted">
          表示できるAggregateがありません。
        </p>
      )}
    </section>
  )
}
