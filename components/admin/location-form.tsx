"use client"

import { useState } from "react"
import { createLocation } from "@/server-actions/locations/create-location"
import { updateLoacation } from "@/server-actions/locations/update-location"
import { Section } from "../ui/section"
import { Surface } from "../ui/surface"

import type { Location } from "@/types/location"
import type { Region } from "@/types/region"
import type { Mode } from "@/types/utils/mode"
import type { BoolFlag } from "@/types/utils/boolean-type"



type LocationFormProps = { mode: Mode; initialData?: Location; regions: Region[] }

export default function LocationForm({ mode, initialData, regions }: LocationFormProps) {
  const [name, setName] = useState(initialData?.name ?? "")
  const [fast_travel, setFastTravel] = useState<BoolFlag>(initialData?.fast_travel ?? false)
  const [x, setX] = useState(initialData?.x ?? "")
  const [y, setY] = useState(initialData?.y ?? "")
  const [parent_region_id, setParentRegionId] = useState(initialData?.parent_region_id ?? "")
  const [slug, setSlug] = useState(initialData?.slug ?? "")
  const [status, setStatus] = useState("")

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("name", name)
    formData.append("fast_travel", String(fast_travel))
    formData.append("x", String(x))
    formData.append("y", String(y))
    formData.append("parent_region_id", parent_region_id)
    formData.append("slug", slug)
    //formData.append("createDate", createDate)

    let result

    if (mode === "create") {
      result = await createLocation(formData)
    } else {
      if (!initialData) {
        setStatus("編集対象のロケーションが指定されていません")
        return
      }
      result = await updateLoacation(initialData.id, formData)
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

            <h2 className="text-xl font-bold">ロケーション登録</h2>

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

              {/* ファストトラベルの有無 */}
              <div className="flex grid-cols-3 gap-1">
                <label className="text-sm text-ananta-muted">ファストトラベルの有無</label>
                <select
                  value={fast_travel ? "true" : "false"}
                  onChange={(e) => setFastTravel(e.target.value === "true")}
                  className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2 text-sm"
                >
                  <option value="true">有</option>
                  <option value="false">無</option>
                </select>

                {/* X */}
                <label className="text-sm text-ananta-muted">X座標</label>
                <input
                  type="number"
                  value={x}
                  onChange={(e) => setX(e.target.value)}
                  className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2"
                />

                {/* Y */}
                <label className="text-sm text-ananta-muted">Y座標</label>
                <input
                  type="number"
                  value={y}
                  onChange={(e) => setY(e.target.value)}
                  className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2"
                />
              </div>

              {/* 属する地域 */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-ananta-muted">属する地域</label>
                <select
                  value={parent_region_id}
                  onChange={(e) => setParentRegionId(e.target.value)}
                  className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2"
                >
                  <option value="">未設定</option>

                  {regions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
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
