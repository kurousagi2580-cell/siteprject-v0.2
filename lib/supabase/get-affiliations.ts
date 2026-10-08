import { fetchData } from "@/lib/supabase/queries"
import type { Affiliation } from "@/types/affiliation"

export async function getAffiliations() {
    return await fetchData<Affiliation>("affiliation", {
        select: `
      *
    `,
        order: [{ column: "id", ascending: true }],
    })
}