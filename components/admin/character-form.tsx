"use client"

import { useState } from "react"
import { createCharacter } from "@/server-actions/characters/create-character"
import { updateCharacter } from "@/server-actions/characters/update-character"
import { Section } from "../ui/section"
import { Surface } from "../ui/surface"
import { CHARACTER_TYPES } from "@/types/utils/character-type"

import type { Character } from "@/types/character"
import type { Affiliation } from "@/types/affiliation"
import type { Mode } from "@/types/utils/mode"
import type { CharacterType } from "@/types/utils/character-type"


type CharacterFormProps = { mode: Mode; initialData?: Character; affiliations: Affiliation[] }

export default function CharacterForm({ mode, initialData, affiliations }: CharacterFormProps) {
  const [name, setName] = useState(initialData?.name ?? "")
  const [shortName, setShortName] = useState(initialData?.short_name ?? "")
  const [imageUrl, setImageUrl] = useState(initialData?.image_url ?? "")
  const [type, setType] = useState(initialData?.type ?? "")
  const [age, setAge] = useState(initialData?.profile?.age ?? "")
  const [height, setHeight] = useState(initialData?.profile?.height ?? "")
  const [birthday, setBirthday] = useState(initialData?.profile?.birthday ?? "")
  const [favorites, setFavorites] = useState(
    initialData?.profile?.favorites?.join(", ") ?? ""
  )
  const [voiceActor, setVoiceActor] = useState(
    initialData?.profile?.voice_actor ?? ""
  )
  const profile = {
    age: age ? Number(age) : null,
    height: height ? Number(height) : null,
    birthday: birthday || null,
    favorites: favorites ? favorites.split(",").map((v) => v.trim()) : null,
    voice_actor: voiceActor || null,
  }
  const [affiliationId, setAffiliationId] = useState(initialData?.affiliation_id ?? "")
  const [spaction, setSpaction] = useState(initialData?.spaction ?? "")
  const [slug, setSlug] = useState(initialData?.slug ?? "")
  const [status, setStatus] = useState("")

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("name", name)
    formData.append("short_name", shortName)
    formData.append("image_url", imageUrl)
    formData.append("type", type)
    formData.append("profile", JSON.stringify(profile))
    formData.append("affiliation_id", affiliationId)
    formData.append("spaction", spaction)
    formData.append("slug", slug)

    let result

    if (mode === "create") {
      result = await createCharacter(formData)
    } else {
      if (!initialData) {
        setStatus("編集対象のキャラクターが指定されていません")
        return
      }
      result = await updateCharacter(initialData.id, formData)
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

            <h2 className="text-xl font-bold">キャラクター登録</h2>

            <form onSubmit={onSubmit} className="flex flex-col gap-6">

              {/* 名前 */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-ananta-muted">名前</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2"
                />
              </div>

              {/* 短縮名 */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-ananta-muted">短縮名</label>
                <input
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2"
                />
              </div>

              {/* 年齢 */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-ananta-muted">年齢</label>
                <input
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2"
                />
              </div>

              {/* 身長 */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-ananta-muted">身長</label>
                <input
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2"
                />
              </div>

              {/* 誕生日 */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-ananta-muted">誕生日</label>
                <input
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2"
                />
              </div>

              {/* 好きなもの */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-ananta-muted">好きなもの（カンマ区切り）</label>
                <input
                  value={favorites}
                  onChange={(e) => setFavorites(e.target.value)}
                  className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2"
                />
              </div>

              {/* 声優 */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-ananta-muted">声優</label>
                <input
                  value={voiceActor}
                  onChange={(e) => setVoiceActor(e.target.value)}
                  className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2"
                />
              </div>

              {/* slug */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-ananta-muted">Slug</label>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2"
                />
              </div>

              {/* 画像URL */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-ananta-muted">画像URL</label>
                <input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2"
                />
              </div>

              {/* タイプ */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-ananta-muted">タイプ</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as CharacterType)}
                  className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2"
                >
                  {CHARACTER_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* 所属 */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-ananta-muted">所属</label>
                <select
                  value={affiliationId}
                  onChange={(e) => setAffiliationId(e.target.value)}
                  className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2"
                >
                  <option value="">未所属</option>

                  {affiliations.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.parent_affiliation_id ? "└ " : ""}
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 特殊アクション */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-ananta-muted">特殊アクション</label>
                <input
                  value={spaction}
                  onChange={(e) => setSpaction(e.target.value)}
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
