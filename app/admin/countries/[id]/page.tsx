import { fetchData } from "@/lib/supabase/queries"
import CountryForm from "@/components/admin/country-form"
import { Country } from "@/types/country"

export default async function CountriesEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
    const country = await fetchData<Country>("countries", {
      select: "id, name, short_name, image_url, description, created_at, slug",
      filters: [{ column: "id", operator: "eq", value: id }],
      single: true
    })
  
    if (!country) {
      return null
    }

  return <CountryForm mode= "edit" initialData={country} />
}
