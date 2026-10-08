import { fetchData } from "@/lib/supabase/queries"
import type { Page } from "@/types/page"

export async function getPages() {
    return await fetchData<Page>("pages", {
        select: `
      *
    `,
        order: [{ column: "id", ascending: true }],
    })
}