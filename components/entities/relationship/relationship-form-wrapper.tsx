// src/components/admin/RelationshipFormWrapper.tsx
"use client";

import type { SchemaField } from "@/components/entities/common/file-renderes";
import { makeFormHandlers } from "@/lib/api/form-api";
import { denormalizeDotKeys } from "@/lib/utils/denormalize-dot";
import EntityForm from "@/components/entities/common/entity-form";
import type { Relationship } from "@/types/relationships";

type CharacterOption = { id: string; name: string };

const relationshipSchema: SchemaField[] = [
  { key: "character_id", label: "キャラクター", type: "select", options: [] },
  { key: "target_character_id", label: "対象キャラクター", type: "select", options: [] },
  { key: "relation_type", label: "関係タイプ", type: "text" },
  { key: "direction", label: "方向性", type: "select", options: [] },
  { key: "relation_description", label: "説明", type: "textarea" },
  // updated_at は表示のみ（必要なら read-only フィールドとして扱う）
];

const basepath = "/api/admin/relations"

export default function RelationshipFormWrapper({
  mode,
  initialData,
  characters,
}: {
  mode: "create" | "edit";
  initialData?: Partial<Relationship>;
  characters?: CharacterOption[];
}) {
  const schema = relationshipSchema.map((f) => {
    if (f.key === "character_id" || f.key === "target_character_id") {
      return {
        ...f,
        options: (characters ?? []).map((c) => ({ value: c.id, label: c.name })),
      };
    }
    if (f.key === "direction") {
      return {
        ...f,
        options: [
          { value: "none", label: "未設定" },
          { value: "one-way", label: "⇒（一方通行）" },
          { value: "two-way", label: "⇔（相互関係）" },
        ],
      };
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
