import { CheckSquare } from "lucide-react"
import type { Comment } from "@/types/comment"
import { CardPanel } from "@/components/ui/card-panel"
import { toDateTimeString } from "@/lib/utils/toDateTimeString"

export function CommentItem({
  comment,
  comments,
  onReply,
}: {
  comment: Comment
  comments: Comment[]
  onReply: (id: string) => void
}) {
  const parentNumber =
    comment.parent_id !== null
      ? comments.find((pc) => pc.id === comment.parent_id)?.number
      : null

  return (
    <CardPanel className="p-4">
      {/* ▼ 返信ラベル（デザイン変更なし） */}
      {parentNumber && (
        <p className="text-xs text-ananta-accent mb-1">
          返信 #{parentNumber}
        </p>
      )}

      {/* ▼ コメントヘッダー */}
      <div className="flex items-center justify-between text-xs text-ananta-muted">
        <span>
          #{comment.number} {comment.user_name} {toDateTimeString(comment.created_at)}
        </span>

        <button
          type="button"
          onClick={() => onReply(comment.id)}
          className="text-ananta-accent font-bold hover:underline"
        >
          返信
        </button>
      </div>

      {/* ▼ 本文 */}
      <p className="mt-2 text-sm text-ananta-text">{comment.content}</p>

      {comment.is_adopted && (
        <p className="mt-2 flex items-center gap-1 text-xs text-green-600">
          <CheckSquare className="size-3.5" />
          採用済み
        </p>
      )}
    </CardPanel>
  )
}
