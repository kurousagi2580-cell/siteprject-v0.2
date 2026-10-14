import AffiliationForm from "@/components/entities/affiliation/affiliation-form"
import { getAffiliationList } from "@/actions/affiliations-actions-server";
import type { Affiliation } from "@/types/affiliation";

export default async function Page() {

  const affRes = await getAffiliationList();
    const affiliations: Affiliation[] = affRes?.items ?? []

  return <AffiliationForm mode="create" affiliations={affiliations} />
}
