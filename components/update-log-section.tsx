// components/update-log-section.tsx


import { CardPanel } from "@/components/ui/card-panel"
import { GameSectionTitle } from "@/components/ui/game-section-title"
import type { UpdateLog } from "@/types/updatelog"

export function UpdateLogSection({
  updates,
  title = "UPDATE LOG",
  subtitle = "最新の更新情報",
}: {
  updates: UpdateLog[]
  title?: string
  subtitle?: string
}) {
  return (
    <section className="mt-6 mb-4">
      {/* セクション内の項目に余白を付ける */}
      <div className="space-y-4">

        {/* 見出し */}
        <GameSectionTitle title={title} subtitle={subtitle} />

        {/* 更新ログ一覧 */}
        <CardPanel>
          {updates.length === 0 ? (
            <p className="text-sm text-ananta-muted">現在更新情報はありません。</p>
          ) : (
            <ul className="flex flex-col gap-3 text-sm text-ananta-text">
              {updates.slice(0, 5).map((u) => (
                <li key={u.id} className="flex flex-col">
                  <span className="font-bold">{u.target_id}</span>
                  <span className="text-ananta-muted text-xs">
                    {u.created_at} - {u.description}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardPanel>

      </div>
    </section>
  )
}
