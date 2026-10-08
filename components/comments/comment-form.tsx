"use client"

export function CommentForm({
  name,
  content,
  loading,
  setName,
  setContent,
  onSubmit,
}: {
  name: string
  content: string
  loading: boolean
  setName: (v: string) => void
  setContent: (v: string) => void
  onSubmit: () => void
}) {
  return (
    <div>
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

      <div className="text-right">
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="text-sm font-bold bg-ananta-accent text-black px-3 py-1 rounded hover:opacity-90"
        >
          {loading ? "送信中…" : "投稿する"}
        </button>
      </div>
    </div>
  )
}
