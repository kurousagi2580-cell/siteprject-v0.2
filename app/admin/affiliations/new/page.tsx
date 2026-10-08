import AffiliationForm from "@/components/admin/affiliation-form"
import { getAffiliations } from "@/lib/supabase/get-affiliations"

export default async function Page() {
  const affiliations = await getAffiliations()
  return <AffiliationForm mode="create" affiliations={affiliations} />
}
