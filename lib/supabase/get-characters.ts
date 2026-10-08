import { fetchData } from "@/lib/supabase/queries"
import type { Character } from "@/types/character"

export async function getCharacters() {
    return await fetchData<Character>("characters", {
        select: `
      *
    `,
        order: [{ column: "id", ascending: true }],
    })
}