// components/comments/comment-list-client.tsx
"use client";

import { useState } from "react";
import type { Comment } from "@/types/comment";
import {CommentItem} from "@/components/comments/comment-item";
import ReplyForm from "@/components/comments/reply-form";

export default function CommentListClient({
  comments,
  pageId,
}: {
  comments: Comment[];
  pageId: string;
}) {
  // どのコメントに対して返信フォームを開くかを管理
  const [replyingId, setReplyingId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {comments.length === 0 ? (
        <p className="text-sm text-ananta-muted">まだコメントはありません。</p>
      ) : (
        comments.map((c) => {
          const parentNumber =
            c.parent_id !== null
              ? comments.find((pc) => pc.id === c.parent_id)?.number
              : null;

          return (
            <div key={c.id}>
              <CommentItem
                comment={c}
                comments={comments}
                onReply={() => setReplyingId((prev) => (prev === c.id ? null : c.id))}
              />

              {/* 返信フォームは Client 側で表示制御 */}
              {replyingId === c.id && (
                <div className="mt-2">
                  <ReplyForm
                    pageId={pageId}
                    parentId={c.id}
                    parentNumber={c.number}
                    onSuccess={() => {
                      // 投稿成功時はフォームを閉じる
                      setReplyingId(null);
                    }}
                  />
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
