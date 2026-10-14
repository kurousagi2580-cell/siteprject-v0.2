// components/comments/reply-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CardPanel } from "@/components/ui/card-panel";

export default function ReplyForm({
  pageId,
  parentId,
  parentNumber,
  onSuccess,
}: {
  pageId: string;
  parentId: string | null;
  parentNumber: number;
  onSuccess?: () => void;
}) {
  const [name, setName] = useState<string>("名無し");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit() {
    if (!content.trim()) {
      setError("本文を入力してください。");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_id: pageId,
          content,
          user_name: name,
          parent_id: parentId,
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        setError(json?.error ?? "投稿に失敗しました。");
        setLoading(false);
        return;
      }

      setContent("");
      // サーバー側の一覧を再取得して更新
      router.refresh();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("返信投稿エラー", err);
      setError("投稿中にエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <CardPanel className="p-4 mt-4">
      <p className="mb-2 text-xs text-ananta-accent">返信対象: #{parentNumber}</p>

      <div className="mb-3 flex items-center gap-2">
        <label className="w-12 shrink-0 text-sm text-ananta-text">名前:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-48 rounded border border-ananta-border bg-ananta-surface2 px-2 py-1 text-sm text-ananta-text"
        />
      </div>

      <div className="mb-3 flex items-start gap-2">
        <label className="w-12 shrink-0 pt-1 text-sm text-ananta-text">本文:</label>
        <textarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 rounded border border-ananta-border bg-ananta-surface2 px-2 py-1 text-sm text-ananta-text"
        />
      </div>

      {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

      <div className="text-right">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="text-sm font-bold bg-ananta-accent text-black px-3 py-1 rounded hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "送信中…" : "投稿する"}
        </button>
      </div>
    </CardPanel>
  );
}
