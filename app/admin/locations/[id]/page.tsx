import { fetchData } from "@/lib/supabase/queries"
import { getRegions } from "@/lib/supabase/get-regions"
import LocationForm from "@/components/admin/location-form"
import { Location } from "@/types/location"

export default async function LocationsEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
    
  const regions = await getRegions()
    if (!regions) {
      return null
    }

    const locations = await fetchData<Location>("regions", {
      select: "id, name, fast_travel, x, y, parent_region_id, created_at",
      filters: [{ column: "id", operator: "eq", value: id }],
      single: true
    })
  
    if (!locations) {
      return null
    }

  return <LocationForm mode= "edit" initialData={locations} regions={regions}/>
}
