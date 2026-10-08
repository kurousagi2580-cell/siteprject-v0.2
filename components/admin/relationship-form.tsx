"use client"

import { useState } from "react"
import { createRelationShips } from "@/server-actions/relationships/create-relationships"
import { updateRelationShips } from "@/server-actions/relationships/update-relationships"
import { Section } from "../ui/section"
import { Surface } from "../ui/surface"

import type { Relationship } from "@/types/relationships"
import type { Character } from "@/types/character"
import type { Mode } from "@/types/utils/mode"




type RelationShipsFormProps = { mode: Mode; initialData?: Relationship; characters: Character[]}

export default function RelationShipsForm({ mode, initialData, characters }: RelationShipsFormProps) {
  const [character_id, setCharacterId] = useState(initialData?.character_id ?? "")
  const [target_character_id, setTargetCharacterId] = useState(initialData?.target_character_id ?? "")
  const [relation_type, setRelationType] = useState(initialData?.relation_type ?? "")
  const [direction, setDirection] = useState(initialData?.direction ?? "")
  const [relation_description, setRelationDesctiption] = useState(initialData?.relation_description ?? "")
  const [updated_at] = useState(initialData?.updated_at ?? "")
  const [status, setStatus] = useState("")

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("character_id", character_id)
    formData.append("target_character_id", target_character_id)
    formData.append("relation_type", relation_type)
    formData.append("direction", direction)
    formData.append("relation_description", relation_description)
    formData.append("updated_at", updated_at)

    let result

    if (mode === "create") {
      result = await createRelationShips(formData)
    } else {
      if (!initialData) {
        setStatus("編集対象のロケーションが指定されていません")
        return
      }
      result = await updateRelationShips(initialData.id, formData)
    }

    if (!result.success) {
      setStatus(`保存に失敗しました：${result.error}`)
      return
    }

    setStatus("保存しました")
  }

  return (
    <div className="px-6 py-10 flex gap-10">

      {/* 入力欄 */}
      <div className="flex-1">
        <Section id="form">
          <Surface variant="raised" className="p-6 rounded-xl flex flex-col gap-6">

            <h2 className="text-xl font-bold">キャラクター関係性登録</h2>

            <form onSubmit={onSubmit} className="flex flex-col gap-6">

              {/* キャラクター   */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-ananta-muted">キャラクター</label>
                <select
                  value={character_id}
                  onChange={(e) => setCharacterId(e.target.value)}
                  className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2"
                >
                  <option value="">未設定</option>

                  {characters.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

               {/* キャラクター相手   */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-ananta-muted">相手キャラクター</label>
                <select
                  value={target_character_id}
                  onChange={(e) => setTargetCharacterId(e.target.value)}
                  className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2"
                >
                  <option value="">未設定</option>

                  {characters.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 関係性 */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-ananta-muted">関係性</label>
                <input
                  value={relation_type}
                  onChange={(e) => setRelationType(e.target.value)}
                  className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2"
                />
              </div>

              {/* 方向 */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-ananta-muted">関係の方向（⇒ or ⇔）</label>
                <select
                  value={direction}
                  onChange={(e) => setDirection(e.target.value)}
                  className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2 text-sm"
                >
                  <option value="none">未設定</option>
                  <option value="one-way">⇒（一方通行）</option>
                  <option value="two-way">⇔（相互関係）</option>
                </select>
              </div>

              {/* 関係性の詳細 */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-ananta-muted">関係性の詳細</label>
                <input
                  value={relation_description}
                  onChange={(e) => setRelationDesctiption(e.target.value)}
                  className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2"
                />
              </div>

              <button
                type="submit"
                className="bg-ananta-accent text-white px-4 py-2 rounded hover:bg-ananta-accent/80"
              >
                保存する
              </button>

              {status && (
                <p className="text-sm text-ananta-muted">{status}</p>
              )}
            </form>
          </Surface>
        </Section>
      </div>
    </div>
  )
}
