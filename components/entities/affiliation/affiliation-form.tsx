// src/components/admin/AffiliationFormWrapper.tsx
"use client";

import type { SchemaField } from "@/components/entities/common/file-renderes";
import { makeFormHandlers } from "@/lib/api/form-api";
import { denormalizeDotKeys } from "@/lib/utils/denormalize-dot";
import EntityForm from "@/components/entities/common/entity-form";
import type { Affiliation } from "@/types/affiliation";


const affiliationSchema: SchemaField[] = [
    { key: "name", label: "名称", type: "text", required: true },
    { key: "short_name", label: "短縮名称", type: "text" },
    { key: "icon_url", label: "アイコンURL", type: "image" },
    { key: "description", label: "詳細", type: "textarea" },
    { key: "category", label: "カテゴリー", type: "text" },
    { key: "parent_affiliation_id", label: "親子関係", type: "select", options: [] },
    { key: "slug", label: "スラッグ", type: "text" },
    { key: "order", label: "表示順", type: "number" },
];

const basepath = "/api/admin/affiliations"

export default function AffiliationFormWrapper({
    mode,
    initialData,
    affiliations,
}: {
    mode: "create" | "edit";
    initialData?: Affiliation;
    affiliations?: Affiliation[];
}) {
    const schema = affiliationSchema.map((f) =>
        f.key === "parent_affiliation_id"
            ? { ...f, options: (affiliations ?? []).map((a) => ({ value: a.id, label: a.name })) }
            : f
    );

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
