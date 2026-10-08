"use client"

import { useState } from "react"
import { createRegion } from "@/server-actions/regions/create-region"
import { updateCountry } from "@/server-actions/regions/update-region"
import { Section } from "../ui/section"
import { Surface } from "../ui/surface"


import type { Region } from "@/types/region"
import type { Country } from "@/types/country"
import type { Mode } from "@/types/utils/mode"


type RegionFormProps = { mode: Mode; initialData?: Region; countries: Country[] }

export default function RegionForm({ mode, initialData, countries }: RegionFormProps) {
  const [name, setName] = useState(initialData?.name ?? "")
  const [shortName, setShortName] = useState(initialData?.short_name ?? "")
  const [parentId, setParentId] = useState(initialData?.parent_id ?? "")
  const [imageUrl, setImageUrl] = useState(initialData?.image_url ?? "")
  const [description, setDescription] = useState(initialData?.description ?? "")
  const [map_x, setMapX] = useState(initialData?.map_x ?? "")
  const [map_y, setMapY] = useState(initialData?.map_y ?? "")
  const [slug, setSlug] = useState(initialData?.slug ?? "")
  const [status, setStatus] = useState("")

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("name", name)
    formData.append("short_name", shortName)
    formData.append("parentId", parentId)
    formData.append("image_url", imageUrl)
    formData.append("description", description)
    formData.append("map_x", String(map_x))
    formData.append("map_y", String(map_y))
    formData.append("slug", slug)

    let result

    if (mode === "create") {
      result = await createRegion(formData)
    } else {
      if (!initialData) {
        setStatus("編集対象のキャラクターが指定されていません")
        return
      }
      result = await updateCountry(initialData.id, formData)
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

            <h2 className="text-xl font-bold">地域登録</h2>

            <form onSubmit={onSubmit} className="flex flex-col gap-6">

              {/* 名前 */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-ananta-muted">名称</label>
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

              {/* 属する国 */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-ananta-muted">属する国</label>
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2"
                >
                  <option value="">未所属</option>

                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
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

              {/* 詳細 */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-ananta-muted">詳細</label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2"
                />
              </div>

              {/* X座標 */}
              <div className="flex grid-cols-2 gap-1">
                <label className="text-sm text-ananta-muted">X座標</label>
                <input
                  type="number"
                  value={map_x}
                  onChange={(e) => setMapX(e.target.value)}
                  className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2"
                />

              {/* Y座標 */}
                <label className="text-sm text-ananta-muted">Y座標</label>
                <input
                  type="number"
                  value={map_y}
                  onChange={(e) => setMapY(e.target.value)}
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
