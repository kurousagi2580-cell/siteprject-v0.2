// src/components/admin/RegionFormWrapper.tsx
"use client";

import type { Region } from "@/types/region";
import type { SchemaField } from "@/components/entities/common/file-renderes";
import { makeFormHandlers } from "@/lib/api/form-api";
import { denormalizeDotKeys } from "@/lib/utils/denormalize-dot";
import EntityForm from "@/components/entities/common/entity-form";

type CountryOption = { id: string; name: string };

const regionSchema: SchemaField[] = [
  { key: "name", label: "名称", type: "text", required: true },
  { key: "short_name", label: "短縮名", type: "text" },
  { key: "parent_id", label: "親（国）", type: "select", options: [] },
  { key: "image_url", label: "画像URL", type: "image" },
  { key: "description", label: "説明", type: "textarea" },
  { key: "map_x", label: "地図 X 座標", type: "number" },
  { key: "map_y", label: "地図 Y 座標", type: "number" },
  { key: "slug", label: "スラッグ", type: "text" },
];

const basepath = "/api/admin/regions"

export default function RegionFormWrapper({
  mode,
  initialData,
  countries,
}: {
  mode: "create" | "edit";
  initialData?: Partial<Region>;
  countries?: CountryOption[];
}) {
  const schema = regionSchema.map((f) => {
    if (f.key === "parent_id") {
      return { ...f, options: (countries ?? []).map((c) => ({ value: c.id, label: c.name })) };
    }
    return f;
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
