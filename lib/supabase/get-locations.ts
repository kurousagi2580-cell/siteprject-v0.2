import { fetchData } from "@/lib/supabase/queries"
import type { Location } from "@/types/location"

export async function getLocations() {
    return await fetchData<Location>("locations", {
        select: `
      *
    `,
        order: [{ column: "id", ascending: true }],
    })
}