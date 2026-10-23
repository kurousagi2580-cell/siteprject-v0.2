"use client"

import Link from "next/link"
import { AppImage } from "@/components/app-image"
import { CardPanel } from "@/components/ui/card-panel"
import { GameSectionTitle } from "@/components/ui/game-section-title"
import type { GraphCharacter } from "@/types/relationship-graph"

export type PanelRelation = {
  id: string
  partner: GraphCharacter
  label: string
  description: string | null
  /** out: 選択中のキャラ → 相手 / in: 相手 → 選択中のキャラ */
  direction: "out" | "in" | "mutual"
}

const ARROW = { out: "→", in: "←", mutual: "↔" } as const
const ARROW_TITLE = { out: "このキャラから相手への関係", in: "相手からこのキャラへの関係", mutual: "双方向の関係" } as const

export function RelationshipDetailPanel({
  character,
  relations,
  editable,
  onSelect,
  onClose,
}: {
  character: GraphCharacter | null
  relations: PanelRelation[]
  editable: boolean
  onSelect: (id: string) => void
  onClose: () => void
}) {
  return (
    <CardPanel className="lg:max-h-[70vh] lg:overflow-y-auto">
      <GameSectionTitle layout="horizontal" title="CHARACTER" />

      {!character ? (
        <div className="space-y-2 text-sm text-ananta-muted">
          <p>キャラクターを選ぶと、関係のある相手が強調表示されます。</p>
          {editable && <p>ドラッグで位置を動かし、「保存」で公開ページに反映します。</p>}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-ananta-border bg-ananta-surface">
              <AppImage src={character.image || "/noimage.png"} alt="" fill sizes="48px" className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="break-words text-sm font-bold text-ananta-text">{character.fullName}</p>
              <p className="break-words text-xs text-ananta-muted">
                {[character.type, character.affiliation].filter(Boolean).join(" ／ ") || "—"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {character.href && (
              <Link href={character.href} className="no-underline hover:underline">
                キャラクターページへ
              </Link>
            )}
            <button type="button" onClick={onClose} className="text-ananta-muted hover:text-ananta-text">
              選択を解除
            </button>
          </div>

          {relations.length === 0 ? (
            <p className="text-sm text-ananta-muted">表示中の関係はありません。</p>
          ) : (
            <ul className="space-y-2">
              {relations.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(r.partner.id)}
                    className="flex w-full items-start gap-3 rounded-sm border border-ananta-border/60 bg-ananta-surface2/70 p-2 text-left transition hover:border-ananta-accent/60"
                  >
                    <div className="relative size-8 shrink-0 overflow-hidden rounded-full border border-ananta-border bg-ananta-surface">
                      <AppImage src={r.partner.image || "/noimage.png"} alt="" fill sizes="32px" className="object-cover" />
                    </div>
                    <span className="min-w-0 flex-1">
                      <span className="block break-words text-sm font-medium text-ananta-text">{r.partner.name}</span>
                      <span className="block break-words text-xs text-ananta-muted">
                        <span title={ARROW_TITLE[r.direction]} className="mr-1 text-ananta-accent">
                          {ARROW[r.direction]}
                        </span>
                        {r.label || "関係不明"}
                      </span>
                      {r.description && (
                        <span className="mt-1 line-clamp-3 block break-words text-xs text-ananta-muted">
                          {r.description}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </CardPanel>
  )
}
