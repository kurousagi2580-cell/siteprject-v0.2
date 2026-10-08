import { fetchData } from "@/lib/supabase/queries"
import type { Region } from "@/types/region"

export async function getRegions() {
  return await fetchData<Region>("regions", {
    select: `
      id,
      name,
      short_name,
      parent_id,
      image_url,
      description,
      map_x,
      map_y,
      slug,
      created_at
    `,
    order: [{ column: "id", ascending: false }],
  })
}