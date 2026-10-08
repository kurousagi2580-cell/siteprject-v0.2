import { fetchData } from "@/lib/supabase/queries"
import type { GameEvent } from "@/types/gameevents"

export async function getGameEvents() {
  return await fetchData<GameEvent>("game_events", {
    select: `
      id,
      title,
      status,
      start_date,
      end_date,
      image_url,
      created_at,
      articles_slug
    `,
    order: [{ column: "start_date", ascending: false }],
  })
}