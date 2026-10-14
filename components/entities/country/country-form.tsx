// src/components/admin/CountryFormWrapper.tsx
"use client";

import type { Country } from "@/types/country";
import EntityForm from "@/components/entities/common/entity-form";
import { makeFormHandlers } from "@/lib/api/form-api";
import { denormalizeDotKeys } from "@/lib/utils/denormalize-dot";
import type { SchemaField } from "@/components/entities/common/file-renderes";
import { CHARACTER_TYPES } from "@/types/utils/character-type";
import type { Affiliation } from "@/types/affiliation";

const countrySchema: SchemaField[] = [
  { key: "name", label: "名称", type: "text", required: true },
  { key: "short_name", label: "短縮名称", type: "text" },
  { key: "image_url", label: "画像URL", type: "image" },
  { key: "description", label: "詳細", type: "textarea" },
  { key: "slug", label: "スラッグ", type: "text" },
  // created_at は通常サーバー管理なのでフォーム送信には含めないが表示だけしたい場合は read-only フィールドを用意する
];

const basepath = "/api/admin/countries"

export default function CountryFormWrapper({
  mode,
  initialData,
}: {
  mode: "create" | "edit";
  initialData?: Partial<Country>;
}) {

  const { create, update } = makeFormHandlers(basepath, denormalizeDotKeys);

  return (
    <EntityForm
      title={mode === "create" ? "作成" : "編集"}
      schema={countrySchema}
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
