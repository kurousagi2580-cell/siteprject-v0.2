"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useComments from "@/hooks/use-comments";

export default function CommentForm({ pageId, parentId = null }: { pageId: string; parentId?: string | null }) {
  const [name, setName] = useState<string>("名無し");
  const [content, setContent] = useState<string>("");
  const { submit, loading, error } = useComments({ pageId, parentId });
  const router = useRouter();
  const [localError, setLocalError] = useState<string | null>(null);

  async function onSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!content.trim()) {
      setLocalError("コメントを入力してください。");
      return;
    }
    setLocalError(null);

    try {
      await submit(content.trim(), name.trim() || "名無し");
      setContent("");
      router.refresh();
    } catch (err) {
      // エラーメッセージはフック側で設定されるのでここでは追加処理なし
      console.error("コメント投稿エラー", err);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <p className="mb-3 text-xs text-ananta-muted">コメント投稿フォーム</p>

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

      {(localError || error) && <p className="text-sm text-red-500">{localError ?? error}</p>}

      <div className="text-right">
        <button
          type="submit"
          disabled={loading}
          className="text-sm font-bold bg-ananta-accent text-black px-3 py-1 rounded hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "送信中…" : "投稿する"}
        </button>
      </div>
    </form>
  );
}
