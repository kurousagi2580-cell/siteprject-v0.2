"use client"

import { useState } from "react"
import type { Comment } from "@/types/comment"
import { CardPanel } from "@/components/ui/card-panel"
import { GameSectionTitle } from "@/components/ui/game-section-title"

import { CommentForm } from "../comments/comment-form"
import { ReplyForm } from "../comments/reply-form"
import { CommentItem } from "../comments/comment-item"

export function CommentSection({
  comments,
  pageId,
}: {
  comments: Comment[]
  pageId: string
}) {
  const [replyingId, setReplyingId] = useState<string | null>(null)
  const [name, setName] = useState("名無し")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(parentId: string | null) {
    if (!name || !content) return

    setLoading(true)

    await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page_id: pageId,
        user_name: name,
        content,
        parent_id: parentId,
      }),
    })

    window.location.reload()
  }

  return (
    <section id="comments" className="mt-6 mb-4">
      <div className="space-y-4">

        <GameSectionTitle
          title="COMMENTS"
          subtitle="このキャラクターに関するコメント"
        />

        {/* ▼ 通常投稿フォーム */}
        <CardPanel className="p-4">
          <CommentForm
            name={name}
            content={content}
            loading={loading}
            setName={setName}
            setContent={setContent}
            onSubmit={() => handleSubmit(null)}
          />
        </CardPanel>

        {/* ▼ コメント一覧 */}
        <div className="flex flex-col gap-4">
          {comments.map((c) => {
            const parentNumber =
              c.parent_id !== null
                ? comments.find((pc) => pc.id === c.parent_id)?.number
                : null

            return (
              <div key={c.id}>
                <CommentItem
                  comment={c}
                  comments={comments}
                  onReply={(id) => setReplyingId(id)}
                />

                {/* ▼ 返信フォーム（コメント直下） */}
                {replyingId === c.id && (
                  <ReplyForm
                    parentNumber={c.number}
                    name={name}
                    content={content}
                    loading={loading}
                    setName={setName}
                    setContent={setContent}
                    onSubmit={() => handleSubmit(c.id)}
                  />
                )}
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
