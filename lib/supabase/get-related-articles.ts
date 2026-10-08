
import { fetchData } from "@/lib/supabase/queries"
import type { Article } from "@/types/article"

export async function getRelatedArticles(page_id: string) {
    //console.log("引数確認：" + page_id)
    return await fetchData<Article>("articles", {
        select: `
      id,
      title,
      slug,
      eyecatch,
      body,
      category,
      created_at,
      updated_at,
      page_id
    `,
    filters: [{ column: "page_id", operator: "eq", value: page_id }],
    })
}

