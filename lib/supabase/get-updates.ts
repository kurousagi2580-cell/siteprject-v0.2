import { fetchData } from "@/lib/supabase/queries"
import type { Update } from "@/types/update"

export async function getUpdates() {
  return await fetchData<Update>("updates", {
    select: `
      id,
      ver_id,
      title,
      release_date,
      official_url
    `,
    order: [{ column: "release_date", ascending: false }],
  })
}
