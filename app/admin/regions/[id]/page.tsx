import RegionForm from "@/components/entities/region/region-form"
import { getRegionById } from "@/actions/regions-actions-server";
import { getCountryList } from "@/actions/countries-actions-server";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const cotRes = await getCountryList();
  const countries = cotRes?.items ?? []

  const region = await getRegionById(id);
  if (!region) return null;

  const safe = { ...region, created_at: region.created_at?.toString?.(), updated_at: region.updated_at?.toString?.() };

  return <RegionForm mode="edit" initialData={safe} countries={countries} />
}

