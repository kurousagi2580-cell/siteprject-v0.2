// src/components/admin/LocationFormWrapper.tsx
"use client";
import type { NameMaps } from "@/types/namemaps";
import type { SchemaField } from "@/components/entities/common/file-renderes";
import { makeFormHandlers } from "@/lib/api/form-api";
import { denormalizeDotKeys } from "@/lib/utils/denormalize-dot";
import EntityForm from "@/components/entities/common/entity-form";

const NameMapiingSchema: SchemaField[] = [
    { key: "source_text", label: "変換元", type: "text", required: true },
    { key: "hiragana", label: "ひらがな", type: "text", required: true},
    { key: "note", label: "メモ", type: "text" },
    { key: "created_by", label: "作成者", type: "text"},
];

const basepath = "/api/admin/namemappings"

export default function NameMappingFormWrapper({
    mode,
    initialData,
}: {
    mode: "create" | "edit";
    initialData?: Partial<NameMaps>;
}) {

    const { create, update } = makeFormHandlers(basepath, denormalizeDotKeys);

    return (
        <EntityForm
            title={mode === "create" ? "作成" : "編集"}
            schema={NameMapiingSchema}
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
