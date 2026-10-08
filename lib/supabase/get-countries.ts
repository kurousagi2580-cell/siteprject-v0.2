import { fetchData } from "@/lib/supabase/queries"
import type { Country } from "@/types/country"

export async function getCountries() {
    return await fetchData<Country>("countries", {
        select: `
      *
    `,
        order: [{ column: "id", ascending: true }],
    })
}