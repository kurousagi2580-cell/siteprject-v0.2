// src/components/entities/common/EntityForm.tsx
"use client";

import React, { useMemo, useState } from "react";
import FormLayout, { FormResult } from "./form-layout";
import { SchemaField, renderInput } from "./file-renderes";
import { denormalizeDotKeys } from "@/lib/utils/denormalize-dot";
import { MarkdownPreview } from "./markdown-preview";
import { MarkdownEditor } from "./markdown-editor";

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
  markdownEditorLayout?: "inline" | "tabbed";
  viewportLayout?: boolean;
  onSuccess?: () => void;
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
  markdownEditorLayout = "inline",
  viewportLayout = false,
  onSuccess,
}: EntityFormProps) {
  const initialState = useMemo(() => {
    const s: Record<string, any> = {};
    for (const f of schema) {
      s[f.key] = (initialData as any)[f.key] ?? (f.type === "select" ? "" : "");
    }
    return s;
  }, [schema, initialData]);

  const [state, setState] = useState<Record<string, any>>(initialState);
  const [activeTab, setActiveTab] = useState<"details" | "body">("details");
  const markdownField = schema.find((field) => field.type === "markdown");

  function setField(k: string, v: any) {
    setState((s) => ({ ...s, [k]: v }));
  }

  function renderField(field: SchemaField) {
    return (
      <div
        key={field.key}
        className={
          viewportLayout && field.type === "markdown"
            ? "flex h-full min-h-0 flex-col gap-1"
            : "flex flex-col gap-1"
        }
      >
        <label className="text-sm text-ananta-muted">
          {field.label ?? field.key}
          {field.required ? " *" : ""}
        </label>
        {field.type === "markdown" && enablePreview ? (
          <div className={`grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-2 ${viewportLayout ? "" : "min-h-96"}`}>
            <div className="min-h-0">
              <MarkdownEditor
                value={String(state[field.key] ?? "")}
                placeholder={field.placeholder}
                onChange={(value) => setField(field.key, value)}
              />
            </div>
            <div className={`prose prose-invert article-markdown min-h-0 overflow-auto rounded border border-ananta-border/40 bg-ananta-surface p-4 ${viewportLayout ? "h-full" : "min-h-96 max-h-[70vh]"}`}>
              <MarkdownPreview source={String(state[field.key] ?? "")} />
            </div>
          </div>
        ) : (
          renderInput(field, state[field.key], (v) => setField(field.key, v))
        )}
      </div>
    );
  }

  async function submitHandler(payloadFromLayout?: Record<string, any>) {
    // payloadFromLayout is unused; we use controlled state
    const payload: Record<string, any> = {};
    for (const f of schema) payload[f.key] = state[f.key] ?? null;

    const body = transformPayload ? await transformPayload(payload) : denormalizeDotKeys(payload);

    let result: FormResult;
    if (mode === "create") {
      if (!onCreate) return { success: false, error: "onCreate is not provided" };
      result = await onCreate(body);
    } else {
      const id = (initialData as any)?.id;
      if (!id) return { success: false, error: "id is missing for update" };
      if (!onUpdate) return { success: false, error: "onUpdate is not provided" };
      result = await onUpdate(String(id), body);
    }

    if (result.success) onSuccess?.();
    return result;
  }

  return (
    <FormLayout
      title={title ?? (mode === "create" ? "新規作成" : "編集")}
      onSubmit={submitHandler}
      submitLabel={submitLabel}
      className={className}
      viewportLayout={viewportLayout}
    >
      <div className={`flex min-h-0 flex-col ${viewportLayout ? "h-full gap-2" : "gap-6"}`}>
        {markdownEditorLayout === "tabbed" && markdownField ? (
          <>
            <div
              role="tablist"
              aria-label="記事入力項目"
              className="flex shrink-0 gap-2 border-b border-ananta-border/50"
            >
              <button
                id="article-details-tab"
                type="button"
                role="tab"
                aria-selected={activeTab === "details"}
                aria-controls="article-details-panel"
                onClick={() => setActiveTab("details")}
                className={`border-b-2 px-4 py-2 text-sm font-medium transition ${
                  activeTab === "details"
                    ? "border-ananta-accent text-ananta-text"
                    : "border-transparent text-ananta-muted hover:text-ananta-text"
                }`}
              >
                記事情報
              </button>
              <button
                id="article-body-tab"
                type="button"
                role="tab"
                aria-selected={activeTab === "body"}
                aria-controls="article-body-panel"
                onClick={() => setActiveTab("body")}
                className={`border-b-2 px-4 py-2 text-sm font-medium transition ${
                  activeTab === "body"
                    ? "border-ananta-accent text-ananta-text"
                    : "border-transparent text-ananta-muted hover:text-ananta-text"
                }`}
              >
                本文
              </button>
            </div>
            <div
              id="article-details-panel"
              role="tabpanel"
              aria-labelledby="article-details-tab"
              hidden={activeTab !== "details"}
              className={`${activeTab === "details" ? "flex" : "hidden"} flex-col gap-6 ${viewportLayout ? "min-h-0 flex-1 overflow-y-auto py-2" : ""}`}
            >
              {schema.filter((field) => field.key !== markdownField.key).map(renderField)}
            </div>
            <div
              id="article-body-panel"
              role="tabpanel"
              aria-labelledby="article-body-tab"
              hidden={activeTab !== "body"}
              className={`${activeTab === "body" ? "flex flex-col" : "hidden"} ${viewportLayout ? "min-h-0 flex-1 overflow-hidden pt-2" : ""}`}
            >
              {renderField(markdownField)}
            </div>
          </>
        ) : (
          schema.map(renderField)
        )}
      </div>
    </FormLayout>
  );
}
