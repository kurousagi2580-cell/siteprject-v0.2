
import { getCountries } from "@/lib/supabase/get-countries"
import RegionForm from "@/components/admin/region-form"

export default async function Page() {
  const countries = await getCountries()
  return <RegionForm mode= "create" countries={countries} />
}
