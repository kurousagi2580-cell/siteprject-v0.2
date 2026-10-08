// lib/comments.ts
import { fetchData } from "@/lib/supabase/queries"
import type { Comment } from "@/types/comment"

export async function getComments(pageId: string) {
  return await fetchData<Comment>("comments", {
    select: `
      id,
      page_id,
      number,
      user_name,
      content,
      parent_id,
      is_adopted,
      delete_reason,
      created_at
    `,
    filters: [{ column: "page_id", operator: "eq", value: pageId }],
    order: [{ column: "created_at", ascending: false }],
  })
}
