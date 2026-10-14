// src/components/entities/character/CharacterForm.tsx
"use client";

import EntityForm from "@/components/entities/common/entity-form";
import { makeFormHandlers } from "@/lib/api/form-api";
import { denormalizeDotKeys } from "@/lib/utils/denormalize-dot";
import type { SchemaField } from "@/components/entities/common/file-renderes";
import { CHARACTER_TYPES } from "@/types/utils/character-type";
import type { Affiliation } from "@/types/affiliation";

const characterSchema: SchemaField[] = [
  { key: "name", label: "名前", type: "text", required: true },
  { key: "short_name", label: "短縮名", type: "text" },
  { key: "slug", label: "Slug", type: "text" },
  { key: "image_url", label: "画像URL", type: "image" },
  { key: "type", label: "タイプ", type: "select", options: CHARACTER_TYPES.map((t) => ({ value: t, label: t })) },
  { key: "profile.age", label: "年齢", type: "number" },
  { key: "profile.height", label: "身長", type: "number" },
  { key: "profile.birthday", label: "誕生日", type: "text" },
  { key: "profile.favorites", label: "好きなもの（カンマ区切り）", type: "text" },
  { key: "profile.voice_actor", label: "声優", type: "text" },
  { key: "affiliation_id", label: "所属", type: "select", options: [] },
  { key: "spaction", label: "特殊アクション", type: "text" },
];

const basepath = "/api/admin/characters"

export default function CharacterForm({
  mode,
  initialData,
  affiliations,
}: {
  mode: "create" | "edit";
  initialData?: Record<string, any>;
  affiliations?: Affiliation[];
}) {
  const schema = characterSchema.map((f) => {
    if (f.key === "affiliation_id") {
      return { ...f, options: (affiliations ?? []).map((a) => ({ value: a.id, label: a.name })) };
    }
    return f;
  });

  const { create, update } = makeFormHandlers(basepath, denormalizeDotKeys);

  return (
    <EntityForm
      title={mode === "create" ? "キャラクター作成" : "キャラクター編集"}
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
