// src/components/admin/LocationFormWrapper.tsx
"use client";

import type { Location } from "@/types/location";
import type { SchemaField } from "@/components/entities/common/file-renderes";
import { makeFormHandlers } from "@/lib/api/form-api";
import { denormalizeDotKeys } from "@/lib/utils/denormalize-dot";
import EntityForm from "@/components/entities/common/entity-form";

type RegionOption = { id: string; name: string };

const locationSchema: SchemaField[] = [
    { key: "name", label: "名称", type: "text", required: true },
    { key: "fast_travel", label: "ファストトラベル可能", type: "select", options: [] },
    { key: "x", label: "X 座標", type: "number" },
    { key: "y", label: "Y 座標", type: "number" },
    { key: "parent_region_id", label: "親リージョン", type: "select", options: [] },
    { key: "slug", label: "スラッグ", type: "text" },
    { key: "image_url", label: "画像URL", type: "image" },
];

const basepath = "/api/admin/locations"

export default function LocationFormWrapper({
    mode,
    initialData,
    regions,
}: {
    mode: "create" | "edit";
    initialData?: Partial<Location>;
    regions?: RegionOption[];
}) {
    const schema = locationSchema.map((f) => {
        if (f.key === "fast_travel") {
            return {
                ...f,
                options: [
                    { value: "true", label: "有" },
                    { value: "false", label: "無" },
                ],
            };
        }
        if (f.key === "parent_region_id") {
            return { ...f, options: (regions ?? []).map((r) => ({ value: r.id, label: r.name })) };
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
