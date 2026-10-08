import AffiliationForm from "@/components/admin/affiliation-form"
import type { Affiliation } from "@/types/affiliation"
import { fetchData } from "@/lib/supabase/queries"
import { getAffiliations } from "@/lib/supabase/get-affiliations"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const affiliation = await fetchData<Affiliation>("affiliation", {
      select: "id, name, short_name, icon_url, category, parent_affiliation_id, slug, created_at",
      filters: [{ column: "id", operator: "eq", value: id }],
      single:true
    })

  const affiliations = await getAffiliations()
  
  console.log(affiliation)

  if (!affiliation) {
    return null
  }

  return <AffiliationForm mode="edit" initialData={affiliation} affiliations={affiliations}/>
}
