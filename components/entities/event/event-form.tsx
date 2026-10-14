// src/components/admin/EventFormWrapper.tsx
"use client";

import type { GameEvent } from "@/types/gameevents";
import type { SchemaField } from "@/components/entities/common/file-renderes";
import { makeFormHandlers } from "@/lib/api/form-api";
import { denormalizeDotKeys } from "@/lib/utils/denormalize-dot";
import EntityForm from "@/components/entities/common/entity-form";

const eventSchema: SchemaField[] = [
  { key: "title", label: "タイトル", type: "text", required: true },
  { key: "status", label: "ステータス", type: "select", options: [] },
  { key: "start_date", label: "開始日", type: "date" },
  { key: "end_date", label: "終了日", type: "date" },
  { key: "image_url", label: "画像URL", type: "image" },
  { key: "articles_slug", label: "関連記事スラッグ", type: "text" },
  // created_at は表示のみ（送信からは除外）
];

const basepath = "/api/admin/events"

export default function EventFormWrapper({
  mode,
  initialData,
}: {
  mode: "create" | "edit";
  initialData?: Partial<GameEvent>;
}) {

  const schema = eventSchema.map((e) => {
    if (e.key === "status") {
      return {
        ...e,
        options: [
          { value: "none", label: "未開催" },
          { value: "active", label: "開催中" },
          { value: "end", label: "終了" },
        ],
      };
    }
    return e;
  });

  const { create, update } = makeFormHandlers(basepath, denormalizeDotKeys);

  return (
    <EntityForm
      title={mode === "create" ? "作成" : "編集"}
      schema={schema}
      mode={mode}
      initialData={initialData}
      onCreate={create}
      onUpdate={update}
      transformPayload={denormalizeDotKeys}
      submitLabel={mode === "create" ? "作成" : "保存"}
      enablePreview={false}
    />
  );
}
