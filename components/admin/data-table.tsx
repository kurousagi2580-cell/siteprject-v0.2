// src/components/admin/data-table.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { CardPanel } from "@/components/ui/card-panel";
import { CardBox } from "@/components/ui/card-box";
import { useDeleteItem } from "@/hooks/use-delete-item";

export type Column<T = any> = {
  key: string;
  label?: string;
  width?: string;
};

type Props<T = any> = {
  items: T[];
  itemKey?: string;
  columns?: Column<T>[];
  viewMode?: "table" | "card";
  title?: string;
  subtitle?: string;
  basePath?: string; // ← 追加
};

export default function DataTable<T = any>({
  items,
  itemKey = "id",
  columns,
  viewMode = "table",
  title,
  subtitle,
  basePath = "",
}: Props<T>) {
  const router = useRouter();
  const { status, deleteItem } = useDeleteItem();
  const keys =
    columns?.map((c) => c.key) ??
    (items[0] ? Object.keys(items[0] as object) : []);

  function getValue(item: T, key: string): unknown {
    return (item as unknown as Record<string, unknown>)[key];
  }

  async function handleDelete(id: string) {
    const result = await deleteItem(basePath, id);
    if (result.success) router.refresh();
  }

  if (viewMode === "card") {
    return (
      <div className="space-y-4">
        {title && <h2 className="text-xl font-bold">{title}</h2>}
        {subtitle && <p className="text-sm text-ananta-muted">{subtitle}</p>}
        <p aria-live="polite" className="text-sm text-ananta-muted">{status}</p>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <CardBox key={String(getValue(item, itemKey) ?? "")} className="p-4 space-y-2">
              {columns?.map((col) =>
                col.key === "actions" ? (
                  <div key={col.key} className="flex gap-2">
                    <a className="btn" href={`${basePath}/${String(getValue(item, itemKey))}/edit`}>編集</a>
                    <button className="btn-danger" onClick={() => handleDelete(String(getValue(item, itemKey)))}>削除</button>
                  </div>
                ) : (
                  <div key={col.key}>
                    <div className="text-xs text-ananta-muted">{col.label ?? col.key}</div>
                    <div className="text-base font-medium">{String(getValue(item, col.key) ?? "")}</div>
                  </div>
                )
              )}
            </CardBox>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {title && <h2 className="text-xl font-bold">{title}</h2>}
      {subtitle && <p className="text-sm text-ananta-muted">{subtitle}</p>}
      <p aria-live="polite" className="text-sm text-ananta-muted">{status}</p>

      <CardPanel className="overflow-x-auto">
        <table className="w-full text-sm table-fixed min-w-[600px]">
          <thead className="bg-ananta-surface/20">
            <tr>
              {keys.map((k) => {
                const col = columns?.find((c) => c.key === k);
                return (
                  <th key={k} className="px-3 py-2 text-left font-medium text-ananta-muted" style={{ width: col?.width }}>
                    {col?.label ?? k}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={String(getValue(item, itemKey) ?? "")} className="border-t border-ananta-border">
                {keys.map((k) => (
                  <td key={k} className="px-3 py-2 align-top">
                    {k === "actions" ? (
                      <div className="flex gap-2">
                        <a className="btn" href={`${basePath}/${String(getValue(item, itemKey))}/edit`}>編集</a>
                        <button className="btn-danger" onClick={() => handleDelete(String(getValue(item, itemKey)))}>削除</button>
                      </div>
                    ) : (
                      String(getValue(item, k) ?? "")
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardPanel>
    </div>
  );
}
