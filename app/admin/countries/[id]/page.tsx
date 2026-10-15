import { requireAdminPage } from "@/lib/auth/require-admin";
import CountryForm from "@/components/entities/country/country-form"
import { getCountryById } from "@/actions/countries-actions-server";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage();
  const { id } = await params

  const country = await getCountryById(id);
  if (!country) return null;

  const safe = { ...country, created_at: country.created_at?.toString?.()};

  return <CountryForm mode="edit" initialData={safe} />
}
