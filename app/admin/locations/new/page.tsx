
import { getRegions } from "@/lib/supabase/get-regions"
import LocationForm from "@/components/admin/location-form"


export default async function Page() {
  const regions = await getRegions()
  if (!regions) {
    return null
  }
  return <LocationForm mode="create" regions={regions} />
}
