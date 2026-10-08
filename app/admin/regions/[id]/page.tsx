import { fetchData } from "@/lib/supabase/queries"
import { getCountries } from "@/lib/supabase/get-countries"
import RegionForm from "@/components/admin/region-form"
import { Region } from "@/types/region"

export default async function RegionsEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
    
  const countries = await getCountries()
    if (!countries) {
      return null
    }

    const regions = await fetchData<Region>("regions", {
      select: "id, name, short_name, parent_id, image_url, description, map_x, map_y, created_at, slug",
      filters: [{ column: "id", operator: "eq", value: id }],
      single: true
    })
  
    if (!regions) {
      return null
    }

  return <RegionForm mode= "edit" initialData={regions} countries={countries}/>
}
