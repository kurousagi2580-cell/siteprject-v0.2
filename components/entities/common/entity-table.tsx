// src/components/entities/common/EntityTable.tsx
"use client";

import React from "react";

export type ColumnDef = { key: string; label: string; render?: (row: any) => React.ReactNode };

type EntityTableProps = {
  columns: ColumnDef[];
  data: any[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
  pagination?: { page: number; pageSize: number; total?: number };
  className?: string;
};

export default function EntityTable({ columns, data, onEdit, onDelete, pagination, className }: EntityTableProps) {
  return (
    <div className={className}>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="text-left p-2 border-b">{c.label}</th>
            ))}
            <th className="p-2 border-b">操作</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id ?? JSON.stringify(row)}>
              {columns.map((c) => (
                <td key={c.key} className="p-2 align-top border-b">
                  {c.render ? c.render(row) : String(row[c.key] ?? "")}
                </td>
              ))}
              <td className="p-2 border-b">
                <button className="mr-2 text-sm text-blue-600" onClick={() => onEdit(String(row.id))}>編集</button>
                <button className="text-sm text-red-600" onClick={() => onDelete(String(row.id))}>削除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {pagination ? (
        <div className="mt-4 flex items-center justify-between text-sm text-ananta-muted">
          <div>ページ {pagination.page}</div>
          <div>合計 {pagination.total ?? "-"}</div>
        </div>
      ) : null}
    </div>
  );
}
