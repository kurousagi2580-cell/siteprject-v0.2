"use client"

import { useState } from "react"
import { createEvents } from "@/server-actions/game-events/create-events"
import { updateEvents } from "@/server-actions/game-events/update-events"
import { Section } from "../ui/section"
import { Surface } from "../ui/surface"

import type { GameEvent } from "@/types/gameevents"
import type { Mode } from "@/types/utils/mode"




type EventsFormProps = { mode: Mode; initialData?: GameEvent;}

export default function EventsForm({ mode, initialData }: EventsFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "")
  const [event_status, setEventStatus] = useState(initialData?.status ?? "")
  const [start_date, setStartDate] = useState(initialData?.start_date ?? "")
  const [end_date, setEndDate] = useState(initialData?.end_date ?? "")
  const [image_url, setImageUrl] = useState(initialData?.image_url ?? "")
  const [articles_slug, setArticlesSlug] = useState(initialData?.articles_slug ?? "")
  const [createdDate] = useState(initialData?.created_at ?? "")
  const [status, setStatus] = useState("")

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("title", title)
    formData.append("status", event_status)
    formData.append("start_date", start_date)
    formData.append("end_date", end_date)
    formData.append("image_url", image_url)
    formData.append("articles_slug", articles_slug)
    formData.append("createDate", createdDate)

    let result

    if (mode === "create") {
      result = await createEvents(formData)
    } else {
      if (!initialData) {
        setStatus("編集対象のロケーションが指定されていません")
        return
      }
      result = await updateEvents(initialData.id, formData)
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

            <h2 className="text-xl font-bold">イベント登録</h2>

            <form onSubmit={onSubmit} className="flex flex-col gap-6">

              {/* タイトル */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-ananta-muted">イベント名称</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2"
                />
              </div>

              {/* ステータス */}
              <div className="flex grid-cols-3 gap-1">
                <label className="text-sm text-ananta-muted">開催ステータス</label>
                <select
                  value={event_status}
                  onChange={(e) => setEventStatus(e.target.value)}
                  className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2 text-sm"
                >
                  <option value="none">未開催</option>
                  <option value="active">開催中</option>
                  <option value="end">終了</option>
                </select>

                {/* 開始日 */}
                <label className="text-sm text-ananta-muted">開始日</label>
                <input
                  type="date"
                  value={start_date}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2"
                />

                {/* 終了日 */}
                <label className="text-sm text-ananta-muted">終了日</label>
                <input
                  type="date"
                  value={end_date}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2"
                />
              </div>

              {/* イメージURL */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-ananta-muted">画像URL</label>
                <input
                  value={image_url}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2"
                />
              </div>

              {/* slug */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-ananta-muted">検索用スラッグ</label>
                <input
                  value={articles_slug}
                  onChange={(e) => setArticlesSlug(e.target.value)}
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
