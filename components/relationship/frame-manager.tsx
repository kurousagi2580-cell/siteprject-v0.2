"use client"

import { Button } from "@/components/ui/button"
import { FRAME_COLORS, autoFrameColor } from "@/lib/grah/frame-style"
import type { GraphFrame } from "@/types/relationship-graph"

export type FramePatch = Partial<Pick<GraphFrame, "label" | "color" | "visible">>

/** 編集モードの「枠の設定」：表示/非表示、名前、色、自動配置への復帰、自由枠の追加と削除 */
export function FrameManager({
  frames,
  dirtyKeys,
  onChange,
  onResetRect,
  onDelete,
  onAdd,
}: {
  frames: GraphFrame[]
  dirtyKeys: ReadonlySet<string>
  onChange: (key: string, patch: FramePatch) => void
  onResetRect: (key: string) => void
  onDelete: (key: string) => void
  onAdd: () => void
}) {
  return (
    <details className="rounded-sm border border-ananta-border/60 bg-ananta-surface2/40 p-3">
      <summary className="cursor-pointer select-none text-sm font-medium text-ananta-text">
        枠の設定（{frames.filter((f) => f.visible).length} / {frames.length} 件を表示中）
      </summary>

      <div className="mt-3 space-y-3">
        <p className="text-xs text-ananta-muted">
          枠は所属から自動で作られます。枠のラベルをドラッグすると、中のキャラごと移動できます。
          枠をクリック（ラベルを触る）すると四辺・四隅に大きさ変更のハンドルが出ます。手で動かした枠は「手動配置」になり、
          メンバーを動かしても追従しなくなります。
        </p>

        <ul className="max-h-80 space-y-2 overflow-y-auto pr-1">
          {frames.map((f) => {
            const current = f.color ?? autoFrameColor(f.key)
            return (
              <li
                key={f.key}
                className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-sm border border-ananta-border/60 bg-ananta-surface/60 p-2"
              >
                <input
                  type="checkbox"
                  checked={f.visible}
                  onChange={(e) => onChange(f.key, { visible: e.target.checked })}
                  aria-label={`${f.label ?? f.defaultLabel} の枠を表示する`}
                  className="size-4 accent-[#B9FF3D]"
                />
                <input
                  value={f.label ?? f.defaultLabel}
                  onChange={(e) => onChange(f.key, { label: e.target.value })}
                  maxLength={60}
                  aria-label="枠の名前"
                  className="h-8 w-44 min-w-0 rounded border border-ananta-border bg-ananta-surface2 px-2 text-sm text-ananta-text outline-none focus:border-ananta-accent"
                />
                <span className="text-xs text-ananta-muted">
                  {f.affiliationId ? `${f.memberIds.length} 人` : "自由枠"}
                  {f.affiliationId && f.rect ? " ／ 手動配置" : ""}
                  {dirtyKeys.has(f.key) ? " ／ 未保存" : ""}
                </span>

                <div className="flex items-center gap-1" role="group" aria-label="枠の色">
                  {FRAME_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => onChange(f.key, { color: c })}
                      aria-label={`色 ${c}`}
                      aria-pressed={current === c}
                      className={`size-5 rounded-full border ${current === c ? "border-white ring-1 ring-white" : "border-black/40"}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  {f.color && (
                    <button
                      type="button"
                      onClick={() => onChange(f.key, { color: null })}
                      className="ml-1 text-xs text-ananta-muted hover:text-ananta-text"
                    >
                      色を自動に
                    </button>
                  )}
                </div>

                {f.affiliationId && f.rect && (
                  <button
                    type="button"
                    onClick={() => onResetRect(f.key)}
                    className="text-xs text-ananta-muted hover:text-ananta-text"
                  >
                    自動配置に戻す
                  </button>
                )}
                {!f.affiliationId && (
                  <button
                    type="button"
                    onClick={() => onDelete(f.key)}
                    className="text-xs text-destructive hover:underline"
                  >
                    削除
                  </button>
                )}
              </li>
            )
          })}
        </ul>

        <Button variant="outline" onClick={onAdd}>
          自由枠を追加
        </Button>
      </div>
    </details>
  )
}
