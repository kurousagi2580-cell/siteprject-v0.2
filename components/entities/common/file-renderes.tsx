// src/components/entities/common/FieldRenderers.tsx
"use client";

import React from "react";
import { AppImage } from "@/components/app-image"

export type FieldType = "text" | "number" | "textarea" | "select" | "image" | "markdown" | "checkbox" | "date";

export type SchemaField = {
  key: string;
  label?: string;
  type?: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  render?: (props: { value: any; onChange: (v: any) => void; field: SchemaField }) => React.ReactNode;
};

export function renderInput(field: SchemaField, value: any, onChange: (v: any) => void) {
  if (field.render) return field.render({ value, onChange, field });

  const commonClass = "bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2 w-full";

  switch (field.type) {
    case "number":
      return <input type="number" value={value ?? ""} placeholder={field.placeholder} className={commonClass} onChange={(e) => onChange(e.target.value)} />;
    case "textarea":
      return <textarea value={value ?? ""} placeholder={field.placeholder} className={`${commonClass} h-32`} onChange={(e) => onChange(e.target.value)} />;
    case "select":
      return (
        <select value={value ?? ""} className={commonClass} onChange={(e) => onChange(e.target.value)}>
          <option value="">{field.placeholder ?? "選択してください"}</option>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    case "image":
      return (
        <div className="flex flex-col gap-2">
          <input type="text" value={value ?? ""} placeholder={field.placeholder ?? "画像URLを入力"} className={commonClass} onChange={(e) => onChange(e.target.value)} />
          {value ? (
            <div className="relative h-40 w-full">
              <AppImage
                src={String(value)}
                alt={field.label ?? ""}
                fill
                unoptimized
                sizes="320px"
                className="object-contain rounded"
              />
            </div>
          ) : null}
        </div>
      );
    case "markdown":
      return <textarea value={value ?? ""} placeholder={field.placeholder} className={`${commonClass} h-48 font-mono`} onChange={(e) => onChange(e.target.value)} />;
    case "date":
      return <input type="date" value={value ?? ""} placeholder={field.placeholder} className={commonClass} onChange={(e) => onChange(e.target.value)} />;
    case "checkbox":
      return (
        <input
          type="checkbox"
          checked={Boolean(value)}
          className="w-4 h-4 rounded border-ananta-border/40"
          onChange={(e) => onChange(e.target.checked)}
        />
      );
    case "text":
    default:
      return <input type="text" value={value ?? ""} placeholder={field.placeholder} className={commonClass} onChange={(e) => onChange(e.target.value)} />;
  }
}
