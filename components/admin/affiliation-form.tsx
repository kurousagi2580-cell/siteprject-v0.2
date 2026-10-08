"use client"

import { useState } from "react"
import { createAffiliation } from "@/server-actions/affiliations/create-affiliation"
import { updateAffiliation } from "@/server-actions/affiliations/update-affiliation"
import { Section } from "../ui/section"
import { Surface } from "../ui/surface"

import type { Affiliation } from "@/types/affiliation"
import type { Mode } from "@/types/utils/mode"

type AffiliationFormProps = { mode: Mode; initialData?: Affiliation; affiliations: Affiliation[]}

export default function AffiliationForm({ mode, initialData, affiliations }: AffiliationFormProps) {
  const [name, setName] = useState(initialData?.name ?? "")
  const [short_name, setShortName] = useState(initialData?.short_name ?? "")
  const [icon_url, setIconUrl] = useState(initialData?.icon_url ?? "")
  const [description, setDescription] = useState(initialData?.description ?? "")
  const [category, setCategory] = useState(initialData?.category ?? "")
  const [parent_affiliation_id, setParentId] = useState(initialData?.parent_affiliation_id ?? "")
  const [slug, setSlug] = useState(initialData?.slug ?? "")
  const [created_at] = useState(initialData?.created_at ?? "")
  const [status, setStatus] = useState("")

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("name", name)
    formData.append("short_name", short_name)
    formData.append("icon_url", icon_url)
    formData.append("description", description)
    formData.append("category", category)
    formData.append("parent_affiliation_id", parent_affiliation_id)
    formData.append("slug", slug)
    formData.append("created_at", created_at)

    let result

    if (mode === "create") {
      result = await createAffiliation(formData)
    } else {
      if (!initialData) {
        setStatus("編集対象のロケーションが指定されていません")
        return
      }
      result = await updateAffiliation(initialData.id, formData)
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

            <h2 className="text-xl font-bold">所属登録</h2>

            <form onSubmit={onSubmit} className="flex flex-col gap-6">

              {/* 名称   */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-ananta-muted">名称</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2"
                />
              </div>

               {/* 短縮名称   */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-ananta-muted">短縮名称</label>
                <input
                  value={short_name}
                  onChange={(e) => setShortName(e.target.value)}
                  className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2"
                />
              </div>

              {/* アイコンURL */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-ananta-muted">アイコンURL</label>
                <input
                  value={icon_url}
                  onChange={(e) => setIconUrl(e.target.value)}
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

              {/* カテゴリー */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-ananta-muted">カテゴリー</label>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2"
                />
              </div>

              {/* 親子関係 */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-ananta-muted">親子関係</label>
                <select
                  value={parent_affiliation_id}
                  onChange={(e) => setParentId(e.target.value)}
                  className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2 text-sm"
                >
                  <option value="">親なし</option>
                  {affiliations.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.parent_affiliation_id ? "└ " : ""}
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* スラッグ */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-ananta-muted">スラッグ</label>
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
