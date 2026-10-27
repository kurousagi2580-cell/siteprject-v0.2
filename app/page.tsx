import Link from "next/link"
import { Map as MapIcon, Users, Globe2 as Globe2Icon, type LucideIcon } from "lucide-react"
import { SiteShell } from "@/components/layout/site-shell"
import { HomeTrends } from "@/components/home/home-trends"
import { aggregateSidebarNav } from "@/components/nav-items"
import { getActiveAggregatePageData } from "@/lib/supabase/queries/aggregate"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { UpdateLog } from "@/types/updatelog"

const aggregateIcons: Record<string, LucideIcon> = {
  キャラクター図鑑: Users,
  地理: MapIcon,
  世界観: Globe2Icon,
}

type RecentUpdateGroup = {
  label: string
  items: UpdateLog[]
}

function getUpdateStateLabel(checkType: string) {
  switch (checkType) {
    case "new":
      return "新規作成"
    case "upd":
      return "更新"
    default:
      return "更新"
  }
}

function groupRecentUpdates(items: UpdateLog[]): RecentUpdateGroup[] {
  const groups = new Map<string, RecentUpdateGroup>()
  const now = Date.now()

  for (const item of items) {
    const createdAt = new Date(item.created_at)
    const elapsedMs = now - createdAt.getTime()
    const within24Hours = elapsedMs <= 24 * 60 * 60 * 1000
    const url = item.target_url || "未設定"
    const dateKey = createdAt.toISOString().slice(0, 10)
    const hourKey = String(createdAt.getHours()).padStart(2, "0")
    const bucketKey = within24Hours ? `${dateKey}-${hourKey}-${url}` : `${dateKey}-${url}`

    const existing: RecentUpdateGroup = groups.get(bucketKey) ?? {
      label: within24Hours
        ? `${createdAt.getFullYear()}/${String(createdAt.getMonth() + 1).padStart(2, "0")}/${String(createdAt.getDate()).padStart(2, "0")} ${hourKey}時`
        : `${createdAt.getFullYear()}/${String(createdAt.getMonth() + 1).padStart(2, "0")}/${String(createdAt.getDate()).padStart(2, "0")}`,
      items: [],
    }

    existing.items.push(item)
    groups.set(bucketKey, existing)
  }

  return Array.from(groups.values())
    .map((group) => ({
      label: group.label,
      items: [...group.items].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
    }))
    .sort((a, b) => {
      const aTime = new Date(a.items[0]?.created_at ?? 0).getTime()
      const bTime = new Date(b.items[0]?.created_at ?? 0).getTime()
      return bTime - aTime
    })
}

export default async function TopPage() {
  const aggregatePages = await getActiveAggregatePageData()
  const supabase = createSupabaseServerClient()
  const { data: recentUpdateLogs, error: recentUpdateLogsError } = await supabase
    .from("updateslog")
    .select("*")
    .in("check_type", ["new", "upd"])
    .order("created_at", { ascending: false })
    .limit(10)

  if (recentUpdateLogsError) {
    throw recentUpdateLogsError
  }

  const recentUpdateGroups = groupRecentUpdates((recentUpdateLogs ?? []) as UpdateLog[])

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

      <div className="mt-5 grid min-w-0 gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(240px,1fr)]">
        <HomeTrends aggregatePages={aggregatePages} />

        <section
          aria-labelledby="contributor-ranking-title"
          className="min-w-0 rounded-xl border border-ananta-border/70 bg-ananta-surface2/80 p-4 shadow-lg shadow-black/10 sm:p-5"
        >
          <header className="mb-4 border-b border-ananta-border/50 pb-3">
            <h2
              id="contributor-ranking-title"
              className="text-lg font-bold text-ananta-text"
            >
              最新の更新
            </h2>
          </header>

          {recentUpdateGroups.length === 0 ? (
            <div className="space-y-4">
              <div className="flex min-h-40 items-center justify-center rounded-lg border border-ananta-border/50 bg-ananta-surface/50 px-4 text-center">
                <p className="text-sm text-ananta-muted">
                  直近の更新はありません。
                </p>
              </div>
              <div className="border-t border-ananta-border/50 pt-3 text-right">
                <Link
                  href="/updates"
                  className="inline-flex items-center text-sm font-medium text-ananta-link underline-offset-2 hover:underline"
                >
                  更新履歴を一覧で見る
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {recentUpdateGroups.map((group) => {
                const newestItem = group.items[0]

                return (
                  <div
                    key={`${group.label}-${newestItem?.target_url ?? "unknown"}-${newestItem?.created_at ?? "na"}`}
                    className="space-y-2"
                  >
                    <div className="border-b border-ananta-border/30 pb-1">
                      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ananta-muted">
                        {group.label}
                      </span>
                    </div>

                    <ul className="space-y-2">
                      <li className="leading-relaxed">
                        <a
                          href={newestItem?.target_url ?? "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-ananta-link underline decoration-dotted underline-offset-2 hover:text-ananta-accent"
                        >
                          {newestItem ? `${getUpdateStateLabel(newestItem.check_type)}: ${newestItem.title}` : "更新情報"}
                        </a>
                      </li>
                    </ul>
                  </div>
                )
              })}

              <div className="border-t border-ananta-border/50 pt-3 text-right">
                <Link
                  href="/updates"
                  className="inline-flex items-center text-sm font-medium text-ananta-link underline-offset-2 hover:underline"
                >
                  更新履歴を一覧で見る
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </SiteShell>
  )
}
