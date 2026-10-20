import Link from "next/link"
import { Map, Users, Globe2, type LucideIcon } from "lucide-react"
import { SiteShell } from "@/components/layout/site-shell"
import { aggregateSidebarNav } from "@/components/nav-items"

const aggregateIcons: Record<string, LucideIcon> = {
  キャラクター図鑑: Users,
  地理: Map,
  世界観: Globe2,
}

export default function TopPage() {
  return (
    <SiteShell rightNavMode="none">
      <header className="mt-6 sm:mt-8 mb-10 sm:mb-14">
        <h1 className="text-3xl font-bold tracking-wide text-ananta-text drop-shadow-[0_2px_8px_rgb(0_0_0/0.6)] sm:text-4xl lg:text-6xl">
          ANANTA DATABASE
        </h1>
        <p className="mt-2 text-xs tracking-[0.2em] text-ananta-text/80 drop-shadow-[0_1px_4px_rgb(0_0_0/0.6)] sm:text-sm">
          ようこそ、無限大ANANTA攻略DBへ
        </p>
      </header>

      <figure
        aria-label="注目の画像"
        className="flex w-full aspect-[16/5] min-h-40 items-center justify-center overflow-hidden rounded-t-xl border border-dashed border-ananta-border bg-gradient-to-br from-ananta-surface2 via-ananta-surface to-ananta-surface2 sm:aspect-[16/4]"
      >
        <figcaption className="text-center">
          <span className="block text-sm font-semibold text-ananta-text">注目の画像</span>
          <span className="mt-1 block text-xs text-ananta-muted">画像は未設定です</span>
        </figcaption>
      </figure>

      <section aria-label="データベース一覧">
        <div className="grid grid-cols-3 overflow-hidden rounded-b-xl border-x border-b border-ananta-border/70 bg-ananta-surface2/80">
          {aggregateSidebarNav.map((group) => {
            const Icon = aggregateIcons[group.label] ?? Users

            return (
              <Link
                key={group.label}
                href={group.children[0].href}
                aria-label={group.label}
                className="group flex min-h-28 flex-col items-center justify-center gap-2 border-r border-ananta-border/50 px-2 py-4 text-center no-underline transition last:border-r-0 hover:bg-ananta-surface focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ananta-accent sm:min-h-36 sm:gap-3 sm:py-5"
              >
                <span className="flex size-10 items-center justify-center rounded-full border border-ananta-accent/40 bg-ananta-surface text-ananta-accent shadow-inner shadow-ananta-accent/10 transition group-hover:border-ananta-accent sm:size-12">
                  <Icon aria-hidden="true" className="size-5 sm:size-6" />
                </span>
                <span className="text-xs font-medium text-ananta-text sm:text-sm">
                  {group.label}
                </span>
              </Link>
            )
          })}
        </div>
      </section>
    </SiteShell>
  )
}
