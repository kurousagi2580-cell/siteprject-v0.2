// src/hooks/useDeleteItem.ts
"use client";

import { useState } from "react";

export function useDeleteItem() {
  const [status, setStatus] = useState<string>("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function deleteItem(hrefBase: string, id: string) {
    if (!confirm("本当に削除しますか？")) return { success: false };
    setStatus("");
    setLoadingId(id);
    try {
      // API パスはプロジェクトに合わせて調整してください
      const res = await fetch(`/api/${hrefBase}/${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      setStatus("削除しました");
      return { success: true };
    } catch (err: any) {
      setStatus(`削除に失敗しました: ${err?.message ?? String(err)}`);
      return { success: false, error: String(err) };
    } finally {
      setLoadingId(null);
    }
  }

  return { status, loadingId, deleteItem, setStatus };
}
