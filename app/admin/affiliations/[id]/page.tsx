
import AffiliationForm from "@/components/entities/affiliation/affiliation-form"
import { getAffiliationById, getAffiliationList } from "@/actions/affiliations-actions-server";
import type { Affiliation } from "@/types/affiliation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const affiliation = await getAffiliationById(id);
  if (!affiliation) return null;

  const affRes = await getAffiliationList();
  const affiliations: Affiliation[] = affRes?.items ?? []

  return <AffiliationForm mode="edit" initialData={affiliation} affiliations={affiliations} />
}
