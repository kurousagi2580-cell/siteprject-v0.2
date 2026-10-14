"use client";
import { useState } from "react";

export default function useComments({ pageId, parentId = null }: { pageId: string; parentId?: string | null }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(content: string, userName: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_id: pageId,
          content,
          user_name: userName,
          parent_id: parentId ?? null,
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        const msg = json?.error ?? (await res.text().catch(() => "送信に失敗しました"));
        setError(msg);
        throw new Error(msg);
      }

      const json = await res.json().catch(() => null);
      return json;
    } catch (e: any) {
      setError(e?.message ?? "送信に失敗しました");
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { submit, loading, error };
}
