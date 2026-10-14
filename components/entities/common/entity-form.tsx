// src/components/entities/common/EntityForm.tsx
"use client";

import React, { useMemo, useState } from "react";
import FormLayout, { FormResult } from "./form-layout";
import { SchemaField, renderInput } from "./file-renderes";
import { denormalizeDotKeys } from "@/lib/utils/denormalize-dot";
import dynamic from "next/dynamic";
import { MarkdownPreview } from "./markdown-preview";

export type EntityFormProps = {
  title?: string;
  schema: SchemaField[];
  mode: "create" | "edit";
  initialData?: Record<string, any>;
  onCreate?: (payload: Record<string, any>) => Promise<FormResult>;
  onUpdate?: (id: string, payload: Record<string, any>) => Promise<FormResult>;
  transformPayload?: (p: Record<string, any>) => Record<string, any> | Promise<Record<string, any>>;
  submitLabel?: string;
  className?: string;
  enablePreview?: boolean;
};

export default function EntityForm({
  title,
  schema,
  mode,
  initialData = {},
  onCreate,
  onUpdate,
  transformPayload,
  submitLabel,
  className,
  enablePreview = false,
}: EntityFormProps) {
  const initialState = useMemo(() => {
    const s: Record<string, any> = {};
    for (const f of schema) {
      s[f.key] = (initialData as any)[f.key] ?? (f.type === "select" ? "" : "");
    }
    return s;
  }, [schema, initialData]);

  const [state, setState] = useState<Record<string, any>>(initialState);

  function setField(k: string, v: any) {
    setState((s) => ({ ...s, [k]: v }));
  }

  async function submitHandler(payloadFromLayout?: Record<string, any>) {
    // payloadFromLayout is unused; we use controlled state
    const payload: Record<string, any> = {};
    for (const f of schema) payload[f.key] = state[f.key] ?? null;

    const body = transformPayload ? await transformPayload(payload) : denormalizeDotKeys(payload);

    if (mode === "create") {
      if (!onCreate) return { success: false, error: "onCreate is not provided" };
      return onCreate(body);
    } else {
      const id = (initialData as any)?.id;
      if (!id) return { success: false, error: "id is missing for update" };
      if (!onUpdate) return { success: false, error: "onUpdate is not provided" };
      return onUpdate(String(id), body);
    }
  }

  return (
    <FormLayout title={title ?? (mode === "create" ? "新規作成" : "編集")} onSubmit={submitHandler} submitLabel={submitLabel} className={className}>
      <div className="flex flex-col gap-6">
        {schema.map((field) => (
          <div key={field.key} className="flex flex-col gap-1">
            <label className="text-sm text-ananta-muted">
              {field.label ?? field.key}
              {field.required ? " *" : ""}
            </label>
            {field.type === "markdown" && enablePreview ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>{renderInput(field, state[field.key], (v) => setField(field.key, v))}</div>
                <div className="prose max-h-96 overflow-auto p-4 border rounded bg-white">
                  <MarkdownPreview source={String(state[field.key] ?? "")} />
                </div>
              </div>
            ) : (
              renderInput(field, state[field.key], (v) => setField(field.key, v))
            )}
          </div>
        ))}
      </div>
    </FormLayout>
  );
}
